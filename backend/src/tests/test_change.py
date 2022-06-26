from src.conftest import RequestHandler
from src.app_util import parse_change
from src.routes.change_routes import get_parsed_changes
from src import db
from sqlalchemy import select
from src.models.item_models import Label, Theme

def test_label_changes(app, client):
    # The user with this id is in Project 1, but not an admin
    # The user has also not made any changes so far
    user5_handler = RequestHandler(app, client, 6)
    # Same with this user
    user6_handler = RequestHandler(app, client, 7)
    # Number of changes made by these users
    user5_changes = 0
    user6_changes = 0
    
    # The user with this id is the super admin
    admin_handler = RequestHandler(app, client, 1)

    # The parameters to get the changes
    params = {
        'p_id': 1,
        'item_type': 'Label',
        'i_id': 1
    }

    response = user5_handler.get('/change/changes', params, True)

    # The user should not see any changes
    assert len(response.json) == 0
    
    response = admin_handler.get('/change/changes', params, True)

    # The admin should see changes
    assert len(response.json) > 0

    # Now we create a new label, make a few changes to it with different users and observe things
    # We assume the changes themselves works since they are tested in other places
    # We just test the recording of the changes
    create_params = {
        'labelTypeId': 1, 
        'labelName': 'test_label', 
        'labelDescription': 'test_description',
        'p_id': 1
    }
    # Create the label
    response = user5_handler.post('/label/create', create_params, True)
    # This list will contain the expected descriptions
    descriptions = ['user5 created Label "test_label" of type "Technology"']
    user5_changes += 1

    assert response.status_code == 200

    # Get the id of the new label
    with app.app_context():
        new_l_id = db.session.execute(select(
            Label.id
        ).where(
            Label.name == 'test_label',
            Label.p_id == 1
        )).scalar_one()
    
    # Update the item id with the newly created Label
    params['i_id'] = new_l_id

    # Check only the required users can see that change
    assert len(user5_handler.get('/change/changes', params, True).json) == user5_changes
    assert len(admin_handler.get('/change/changes', params, True).json) == user5_changes + user6_changes
    assert len(user6_handler.get('/change/changes', params, True).json) == user6_changes

    # Edit the label description
    edit_params = {
        'labelId': new_l_id,
        'labelName': 'test_label',
        'labelDescription': 'a new description',
        'p_id': 1
    }
    response = user5_handler.patch('/label/edit', edit_params, True)

    descriptions.append('user5 changed the description of Label "test_label"')
    user5_changes += 1

    assert response.status_code == 200
    
    # Check only the required users can see that change
    assert len(user5_handler.get('/change/changes', params, True).json) == user5_changes
    assert len(admin_handler.get('/change/changes', params, True).json) == user5_changes + user6_changes
    assert len(user6_handler.get('/change/changes', params, True).json) == user6_changes

    # Edit the label name
    edit_params['labelName'] = 'new_name'
    response = user5_handler.patch('/label/edit', edit_params, True)

    descriptions.append('user5 renamed Label "test_label" to "new_name"')
    user5_changes += 1

    assert response.status_code == 200

    
    # Check only the required users can see that change
    assert len(user5_handler.get('/change/changes', params, True).json) == user5_changes
    assert len(admin_handler.get('/change/changes', params, True).json) == user5_changes + user6_changes
    assert len(user6_handler.get('/change/changes', params, True).json) == user6_changes

    # Edit both the name and the description (with a different user)
    edit_params['labelName'] = 'newer_name'
    edit_params['labelDescription'] = 'a newer description'
    response = user6_handler.patch('/label/edit', edit_params, True)

    descriptions.append('user6 changed the description of Label "newer_name"')
    descriptions.append('user6 renamed Label "new_name" to "newer_name"')
    user6_changes += 2

    assert response.status_code == 200

    # Check only the required users can see that change
    assert len(user5_handler.get('/change/changes', params, True).json) == user5_changes
    assert len(admin_handler.get('/change/changes', params, True).json) == user5_changes + user6_changes
    assert len(user6_handler.get('/change/changes', params, True).json) == user6_changes

    delete_params = {
        'l_id': new_l_id,
        'p_id': 1
    }
    response = user6_handler.post('/label/delete', delete_params, True)

    descriptions.append('user6 deleted Label "newer_name"')

    assert response.status_code == 200
    user6_changes += 1

    # Check only the required users can see that change
    assert len(user5_handler.get('/change/changes', params, True).json) == user5_changes
    assert len(admin_handler.get('/change/changes', params, True).json) == user5_changes + user6_changes
    assert len(user6_handler.get('/change/changes', params, True).json) == user6_changes

    changes = admin_handler.get('/change/changes', params, True).json

    response_descriptions = [change['description'] for change in changes]
    # Changes are shown in order from newest to oldest, so reverse
    descriptions.reverse()

    assert response_descriptions == descriptions


# We test this in another function because merging makes _so_ many changes
def test_merge_change(app, client):
    # Corresponding to the super admin
    admin_handler = RequestHandler(app, client, 1)

    # ids of labels that we are merging and how many changes they already had before the merge, and their name and type
    merged_labels = {
        2: (1, "Sad", "Emotion"),
        4: (2, "Angry ", "Emotion")
    }
    # Dict. mapping an artifact id to the number of changes before the merge, and a list of affected labellings
    affected_artifacts = {
        7: (6, [2]),
        5: (5, [2, 4]),
        4: (6, [4]),
        9: (6, [4]),
        6: (5, [4])
    }
    # Idem for themes, but also giving the theme name
    affected_themes = {
        2: (3, [2, 4], "Negative emotions")
    }

    merge_params = {
        'mergedLabels': [*merged_labels],
        'newLabelName': 'merge_label',
        'newLabelDescription': 'This label came from a merge',
        'p_id': 1,
        'labelTypeName': 'Emotion'
    }

    response = admin_handler.post('/label/merge', merge_params, True)

    assert response.status_code == 200

    with app.app_context():
        merge_id = db.session.execute(select(
            Label.id
        ).where(
            Label.name == 'merge_label',
            Label.p_id == 1
        )).scalar_one()

    # Check that changes aren't recorded for the labels used to merge
    for label, info in merged_labels.items():
        response = admin_handler.get('/change/changes', {
            'p_id': 1,
            'item_type': 'Label',
            'i_id': label
        }, True)
        assert len(response.json) == info[0]
    
    # Check that change is recorded for the label created from the merge
    response = admin_handler.get('/change/changes', {
        'p_id': 1,
        'item_type': 'Label',
        'i_id': merge_id
    }, True)
    assert len(response.json) == 1
    assert response.json[0]['description'] == 'admin created Label "merge_label" of type "Emotion" by merging labels ["Sad", "Angry "]'
    
    # Check that the changes for the artifacts were recorded
    for artifact, info in affected_artifacts.items():
        response = admin_handler.get('/change/changes', {
            'p_id': 1,
            'item_type': 'Artifact',
            'i_id': artifact
        }, True)
        # Assert the correct number of changes were recorded
        assert len(response.json) == info[0] + len(info[1])
        # Get the changes from the merge
        new_changes = response.json[:-len(info[1])]
        # Get the descriptions from the changes
        descriptions = [change['description'] for change in new_changes]
        # Assert that there is a correct description for each label
        for label in info[1]:
            assert f'admin changed a labelling for Artifact {artifact} of type "{merged_labels[label][2]}" from "{merged_labels[label][1]}" to "merge_label" as a result of a merge' in descriptions
        
    # Check that the changes for the themes were recorded
    for theme, info in affected_themes.items():
        response = admin_handler.get('/change/changes', {
            'p_id': 1,
            'item_type': 'Theme',
            'i_id': theme
        }, True)
        # Assert the correct number of changes were recorded
        assert len(response.json) == info[0] + len(info[1])
        # Get the changes from the merge
        new_changes = response.json[:-len(info[1])]
        # Get the descriptions from the changes
        descriptions = [change['description'] for change in new_changes]
        # Assert that there is a correct description for each label
        for label in info[1]:
            assert f'Theme "{info[2]}" had Label "{merged_labels[label][1]}" of type "{merged_labels[label][2]}" switched for "merge_label" as a result of a merge admin made'

def test_theme_changes(app, client):
    # The user with this id is in Project 1, but not an admin
    # The user has also not made any changes so far
    user5_handler = RequestHandler(app, client, 6)
    # Same with this user
    user6_handler = RequestHandler(app, client, 7)
    
    # The user with this id is the super admin
    admin_handler = RequestHandler(app, client, 1)

    # The parameters to get the changes
    params = {
        'p_id': 1,
        'item_type': 'Theme',
        'i_id': 1
    }

    response = user5_handler.get('/change/changes', params, True)

    # The user should not see any changes
    assert len(response.json) == 0
    
    response = admin_handler.get('/change/changes', params, True)

    # The admin should see changes
    assert len(response.json) > 0

    # Now we create a new theme, make a few changes to it with different users and observe things
    # We assume the changes themselves works since they are tested in other places
    # We just test the recording of the changes

    # Create a theme
    create_params = {
        'name': "test_theme",
        'description': "Theme made for testing",
        'labels': [{'id': 1}],
        'sub_themes': [{'id': 1}],
        'p_id': 1
    }
    response = user5_handler.post('/theme/create_theme', create_params, True)
    assert response.status_code == 200
    # This list will store the descriptions of each change, in order, to compare to in the end
    descriptions = [
        'user5 created Theme "test_theme"',
        'user5 set subthemes of Theme "test_theme" to ["Positive emotions"]',
        'user5 set labels of Theme "test_theme" to ["Happy "]'
    ]
    # Get the id of the new theme
    with app.app_context():
        new_t_id = db.session.execute(select(
            Theme.id
        ).where(
            Theme.name == 'test_theme',
            Theme.p_id == 1
        )).scalar_one()
    
    # Update the item id with the newly created Label
    params['i_id'] = new_t_id

    # Check only the required users can see that change
    assert len(user5_handler.get('/change/changes', params, True).json) == 3
    assert len(admin_handler.get('/change/changes', params, True).json) == 3
    assert len(user6_handler.get('/change/changes', params, True).json) == 0

    # Editing nothing should not record changes
    edit_params = dict(create_params)
    edit_params['id'] = new_t_id
    response = user5_handler.post('/theme/edit_theme', edit_params, True)
    assert response.status_code == 200
    # Check number of changes has not changed
    assert len(admin_handler.get('/change/changes', params, True).json) == 3

    # Edit theme name
    edit_params['name'] = 'new_name'
    response = user5_handler.post('/theme/edit_theme', edit_params, True)
    # Check only the required users can see that change
    assert len(user5_handler.get('/change/changes', params, True).json) == 4
    assert len(admin_handler.get('/change/changes', params, True).json) == 4
    assert len(user6_handler.get('/change/changes', params, True).json) == 0
    # Edit theme description
    # Edit subthemes
    # Edit labels
    # Edit everything
    # Check order of changes and description