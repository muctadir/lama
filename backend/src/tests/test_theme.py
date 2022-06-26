from sqlalchemy import select
from src import db
from src.conftest import RequestHandler
from src.models.item_models import Theme, Label
from src.routes.theme_routes import get_theme_label_count, make_labels, make_sub_themes, theme_name_taken, get_project_hierarchy

def test_theme_management_info(app, client):
    """
    Function to test whether the theme management info route gives correct errors and information
    """

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # When p_id is not given
    response = request_handler.get("/theme/theme-management-info", {"": ""}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all required arguments supplied"

    # All themes for project 1
    theme_info = [
        {'number_of_labels': 2, 'theme': {'deleted': False, 'description': 'These are backend technologies', 'id': 3, 'name': 'Backend technology', 'p_id': 1, 'super_theme_id': None}}, 
        {'number_of_labels': 1, 'theme': {'deleted': False, 'description': 'These are database technologies', 'id': 7, 'name': 'Database technology', 'p_id': 1, 'super_theme_id': 3}}, 
        {'number_of_labels': 0, 'theme': {'deleted': False, 'description': 'Empty theme desc', 'id': 8, 'name': 'Empty theme', 'p_id': 1, 'super_theme_id': None}}, 
        {'number_of_labels': 2, 'theme': {'deleted': False, 'description': 'These are frontend technologies', 'id': 4, 'name': 'Frontend technologies', 'p_id': 1, 'super_theme_id': None}}, 
        {'number_of_labels': 6, 'theme': {'deleted': False, 'description': 'These are negative emotions', 'id': 2, 'name': 'Negative emotions', 'p_id': 1, 'super_theme_id': None}}, 
        {'number_of_labels': 0, 'theme': {'deleted': False, 'description': 'These are neutral emotions', 'id': 6, 'name': 'Neutral emotions', 'p_id': 1, 'super_theme_id': None}}, 
        {'number_of_labels': 2, 'theme': {'deleted': False, 'description': 'These are positive emotions', 'id': 1, 'name': 'Positive emotions', 'p_id': 1, 'super_theme_id': None}}, 
        {'number_of_labels': 2, 'theme': {'deleted': False, 'description': 'This is technology', 'id': 5, 'name': 'Technology', 'p_id': 1, 'super_theme_id': None}}]
    # The get request
    response = request_handler.get("/theme/theme-management-info", { "p_id": "1" }, True)
    # Check if it was an OK response
    assert response.status_code == 200
    # Check if the aqtual data is correct
    assert response.json == theme_info

def test_single_theme_info(app, client):
    """
    Function to test whether the single info route gives correct errors and information
    """

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # When p_id and t_id are not given
    response = request_handler.get("/theme/single-theme-info", {"p_id": 1, "": ""}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all required arguments supplied"

    response = request_handler.get("/theme/single-theme-info", {"p_id": 1, "t_id": 7}, True)
    # Info for theme 7
    theme_info = {
        'labels': 
            [{'artifacts': 
                [
                    {'data': 'Cras pulvinar enim sed posuere molestie. Integer ultrices, leo sit amet hendrerit sodales, diam dui scelerisque nulla, vitae ullamcorper nulla purus ut magna. Cras elementum vitae augue ut maximus. Donec fringilla pellentesque dapibus. Proin non nisl sed sem laoreet luctus a nec leo. Nunc accumsan turpis et orci dictum, vitae efficitur ex ultricies. Nam consectetur, ipsum eget fringilla ultrices, nisi lacus mollis arcu, vitae varius tellus massa eu eros. Pellentesque eget sollicitudin massa, id mollis turpis. Vestibulum in lorem sit amet ligula pulvinar pellentesque eget in leo. Suspendisse blandit, purus non sagittis tempus, sem elit sodales risus, eleifend porttitor metus nunc a ligula. Cras venenatis ex a mi suscipit ornare. In fringilla sit amet ipsum ut molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus.', 'end': None, 'id': 2, 'identifier': '2FA3F', 'p_id': 1, 'parent_id': None, 'start': None}, 
                    {'data': 'Pellentesque dui purus, cursus id neque eu, bibendum bibendum nisl. Cras elementum ipsum suscipit pulvinar rhoncus. Duis elementum sit amet leo vitae vehicula. Suspendisse rutrum ut turpis ornare lobortis. Donec pretium, urna eu mollis auctor, arcu sapien ultricies leo, ut tincidunt magna metus eu odio. Cras vel velit felis. Vestibulum congue fermentum augue, in efficitur velit feugiat id. Suspendisse ut mauris sed mauris tempor tincidunt. Aliquam vehicula, diam eget pretium ullamcorper, mi magna hendrerit nibh, at commodo arcu lacus porta erat. Nam quam tortor, vulputate vitae velit quis, lobortis vestibulum tortor. Praesent quam nisi, malesuada eget suscipit sit amet, euismod sit amet arcu. Mauris commodo posuere arcu, sit amet vulputate tortor ultrices iaculis. Vestibulum pretium elit non suscipit commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;', 'end': None, 'id': 4, 'identifier': '2FA3F', 'p_id': 1, 'parent_id': None, 'start': None}, 
                    {'data': 'Vestibulum id condimentum nulla. Nunc dignissim orci ut euismod tempus. Morbi velit felis, tempor sed libero nec, dignissim dignissim turpis. Maecenas non commodo lectus, at elementum est. Sed fermentum interdum odio id eleifend. Quisque suscipit ligula felis, non placerat augue accumsan id. Proin vel velit sem. Aliquam ultrices, enim sit amet feugiat porttitor, purus velit tincidunt ligula, sagittis faucibus nisl massa eu tortor. Quisque vehicula augue lacus, vel iaculis augue posuere id. Morbi eu scelerisque nisi, sit amet pretium nibh. Vivamus tincidunt, ex id fermentum venenatis, justo metus convallis ante, ac auctor augue odio vel massa. Donec tempus est diam, sit amet commodo magna luctus id. In hac habitasse platea dictumst. Proin suscipit ut ligula sit amet pellentesque.', 'end': None, 'id': 8, 'identifier': '2FA3F', 'p_id': 1, 'parent_id': None, 'start': None}, 
                    {'data': 'Cras pulvinar enim sed posuere molestie. Integer ultrices, leo sit amet hendrerit sodales, diam dui scelerisque nulla, vitae ullamcorper nulla purus ut magna. Cras elementum vitae augue ut maximus. Donec fringilla pellentesque dapibus. Proin non nisl sed sem laoreet luctus a nec leo. Nunc accumsan turpis et orci dictum, vitae efficitur ex ultricies. Nam consectetur, ipsum eget fringilla ultrices, nisi lacus mollis arcu, vitae varius tellus massa eu eros. Pellentesque eget sollicitudin massa, id mollis turpis. Vestibulum in lorem sit amet ligula pulvinar pellentesque eget in leo. Suspendisse blandit, purus non sagittis tempus, sem elit sodales risus, eleifend porttitor metus nunc a ligula. Cras venenatis ex a mi suscipit ornare. In fringilla sit amet ipsum ut molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus.', 'end': None, 'id': 2, 'identifier': '2FA3F', 'p_id': 1, 'parent_id': None, 'start': None}
                ], 
                'label': {'child_id': None, 'deleted': False, 'description': 'SQL label', 'id': 11, 'lt_id': 1, 'name': 'SQL', 'p_id': 1}, 'label_type': 'Technology'}
            ], 
            'sub_themes': [], 'super_theme': {'deleted': False, 'description': 'These are backend technologies', 'id': 3, 'name': 'Backend technology', 'p_id': 1, 'super_theme_id': None}, 
            'theme': {'deleted': False, 'description': 'These are database technologies', 'id': 7, 'name': 'Database technology', 'p_id': 1, 'super_theme_id': 3}}
    # Check if we got an OK response
    assert response.status_code == 200
    # Check if the info is correct
    assert response.json == theme_info

def test_all_themes_no_parents(app, client):
    """
    Function to test whether the all_themes_no_parents route gives correct errors and information
    """

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # When p_id and t_id are not given
    response = request_handler.get("/theme/possible-sub-themes", {"p_id": 1, "": ""}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all required arguments supplied"

    response = request_handler.get("/theme/possible-sub-themes", {"p_id": 1, "t_id": 7}, True)
    # Parent themes excluding theme 7
    theme_info = [
        {'deleted': False, 'description': 'These are backend technologies', 'id': 3, 'name': 'Backend technology', 'p_id': 1, 'super_theme_id': None}, 
        {'deleted': False, 'description': 'Empty theme desc', 'id': 8, 'name': 'Empty theme', 'p_id': 1, 'super_theme_id': None}, 
        {'deleted': False, 'description': 'These are frontend technologies', 'id': 4, 'name': 'Frontend technologies', 'p_id': 1, 'super_theme_id': None}, 
        {'deleted': False, 'description': 'These are negative emotions', 'id': 2, 'name': 'Negative emotions', 'p_id': 1, 'super_theme_id': None}, 
        {'deleted': False, 'description': 'These are neutral emotions', 'id': 6, 'name': 'Neutral emotions', 'p_id': 1, 'super_theme_id': None}, 
        {'deleted': False, 'description': 'These are positive emotions', 'id': 1, 'name': 'Positive emotions', 'p_id': 1, 'super_theme_id': None}, 
        {'deleted': False, 'description': 'This is technology', 'id': 5, 'name': 'Technology', 'p_id': 1, 'super_theme_id': None}]
    # Check if we got an OK response
    assert response.status_code == 200
    # Check if the info is correct
    assert response.json == theme_info

def test_create_theme(app, client):
    """
    Function to test whether the create theme route gives correct errors and information
    """

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # When p_id and t_id are not given
    response = request_handler.post("/theme/create_theme", {"p_id": 1}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all required arguments supplied"

    # Theme info with whitespaces
    new_theme_info = {
        "name": "Name   ",
        "description": "New desc",
        "labels": [],
        "sub_themes": [],
        "p_id": 1
    }
    # Post request
    response = request_handler.post("/theme/create_theme", new_theme_info, True)
    # Check if error was thrown, and which one
    assert response.status_code == 400
    assert response.text == "Input contains leading or trailing whitespaces"

    # Theme info with forbidden character
    new_theme_info = {
        "name": "Name;",
        "description": "New desc",
        "labels": [],
        "sub_themes": [],
        "p_id": 1
    }
    # Post request
    response = request_handler.post("/theme/create_theme", new_theme_info, True)
    # Check if error was thrown, and which one
    assert response.status_code == 511
    assert response.text == "Input contains a forbidden character"

    # Theme info with already taken name
    new_theme_info = {
        "name": "Technology",
        "description": "New desc",
        "labels": [],
        "sub_themes": [],
        "p_id": 1
    }
    # Post request
    response = request_handler.post("/theme/create_theme", new_theme_info, True)
    # Check if error was thrown, and which one
    assert response.status_code == 400
    assert response.text == "Theme name already exists"

    # app contect for database use
    with app.app_context():
        # Theme info with labels and sub-themes
        new_theme_info = {
            "name": "Theme name",
            "description": "New desc",
            "labels": [{"id":1, "name": "Happy", "l_it": 2, "description": "happy label", "deleted": False, "p_id": 1}],
            "sub_themes": [{"id":1, "name": "Positive emotions", "description": "These are positive emotions", "deleted": False, "p_id": 1}],
            "p_id": 1
        }
        # Post request
        response = request_handler.post("/theme/create_theme", new_theme_info, True)
        # Check if post was succesfull
        assert response.status_code == 200
        assert response.text == "Theme created"

        # Get the theme that was created
        entry = db.session.scalar(select(Theme).where(Theme.name == "Theme name", Theme.p_id == 1))

        # Check that the theme was created correctly
        assert entry.name == "Theme name"
        assert entry.description == "New desc"
        assert entry.p_id == 1
        
        # Get added label
        label = db.session.get(Label, 1)
        assert entry.labels == [label]

        # Get added theme
        theme = db.session.get(Theme, 1)
        assert entry.sub_themes == [theme]
    
def test_edit_theme(app, client):
    """
    Function to test whether the edit theme route gives correct errors and information
    """

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # When p_id and t_id are not given
    response = request_handler.post("/theme/edit_theme", {"p_id": 1}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all required arguments supplied"

    # Theme info with whitespaces
    new_theme_info = {
        "id": 7,
        "name": "Name   ",
        "description": "New desc",
        "labels": [],
        "sub_themes": [],
        "p_id": 1
    }
    # Post request
    response = request_handler.post("/theme/edit_theme", new_theme_info, True)
    # Check if error was thrown, and which one
    assert response.status_code == 400
    assert response.text == "Input contains leading or trailing whitespaces"

    # Theme info with forbidden character
    new_theme_info = {
        "id": 7,
        "name": "Name;",
        "description": "New desc",
        "labels": [],
        "sub_themes": [],
        "p_id": 1
    }
    # Post request
    response = request_handler.post("/theme/edit_theme", new_theme_info, True)
    # Check if error was thrown, and which one
    assert response.status_code == 511
    assert response.text == "Input contains a forbidden character"

    # Theme info with already taken name
    new_theme_info = {
        "id": 7,
        "name": "Technology",
        "description": "New desc",
        "labels": [],
        "sub_themes": [],
        "p_id": 1
    }
    # Post request
    response = request_handler.post("/theme/edit_theme", new_theme_info, True)
    # Check if error was thrown, and which one
    assert response.status_code == 400
    assert response.text == "Theme name already exists"

    # Theme info with unknown id
    new_theme_info = {
        "id": 0,
        "name": "New name",
        "description": "New desc",
        "labels": [],
        "sub_themes": [],
        "p_id": 1
    }
    # Post request
    response = request_handler.post("/theme/edit_theme", new_theme_info, True)
    # Check if error was thrown, and which one
    assert response.status_code == 400
    assert response.text == "Bad request"

    # TODO: check cycle error
    # Theme info with cycle
    # new_theme_info = {
    #     "id": 7,
    #     "name": "New name",
    #     "description": "New desc",
    #     "labels": [{"id":1, "name": "Happy", "l_it": 2, "description": "happy label", "deleted": False, "p_id": 1}],
    #     "sub_themes": [{"id":3, "name": "Backend technology", "description": "These are backend technologies", "deleted": False, "p_id": 1}],
    #     "p_id": 1
    # }
    # # Post request
    # response = request_handler.post("/theme/edit_theme", new_theme_info, True)
    # # Check if error was thrown, and which one
    # assert response.status_code == 400
    # assert response.text == "Your choice of subthemes would introduce a cycle"

    # app contect for database use
    with app.app_context():
        # Theme info with labels and sub-themes
        new_theme_info = {
            "id": 1,
            "name": "New positive emotions",
            "description": "New desc",
            "labels": [{"id":1, "name": "Happy", "l_it": 2, "description": "happy label", "deleted": False, "p_id": 1}],
            "sub_themes": [{"id":6, "name": "Neutral emotions", "description": "These are neutral emotions", "deleted": False, "p_id": 1}],
            "p_id": 1
        }
        # Post request
        response = request_handler.post("/theme/edit_theme", new_theme_info, True)
        # Check if post was succesfull
        assert response.status_code == 200
        assert response.text == "Theme edited"

        # Get the theme that was created
        entry = db.session.get(Theme, 1)

        # Check that the theme was created correctly
        assert entry.name == "New positive emotions"
        assert entry.description == "New desc"
        assert entry.p_id == 1
        
        # Get added label
        label = db.session.get(Label, 1)
        assert entry.labels == [label]

        # Get added theme
        theme = db.session.get(Theme, 6)
        assert entry.sub_themes == [theme]
    
def test_delete_theme(app, client):
    """
    Function to test whether the delete theme route gives correct errors and information
    """

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # When p_id and t_id are not given
    response = request_handler.post("/theme/delete_theme", {"p_id": 1}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all required arguments supplied"

    # Post request
    response = request_handler.post("/theme/delete_theme", {"p_id": 1, "t_id": 0}, True)
    # Check if error was thrown, and which one
    assert response.status_code == 400
    assert response.text == "Bad request"

    # Post request
    response = request_handler.post("/theme/delete_theme", {"p_id": 1, "t_id": 1}, True)
    # Check if deletion was succesful
    assert response.status_code == 200
    assert response.text == "Theme deleted"
    # app contect for database use
    with app.app_context():
        # Get the theme that was deleted
        theme = db.session.get(Theme, 1)
        # Check if the theme was actually deleted
        assert theme.deleted == True


def test_search_theme(app, client):
    """
    Function to test whether the search theme route gives correct errors and information
    """

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # When p_id and t_id are not given
    response = request_handler.get("/theme/search", {"p_id": 1}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all required arguments supplied"

    # Searched info
    search_info = [
        {'deleted': False, 'description': 'These are positive emotions', 'id': 1, 'name': 'Positive emotions', 'p_id': 1, 'super_theme_id': None}, 
        {'deleted': False, 'description': 'These are negative emotions', 'id': 2, 'name': 'Negative emotions', 'p_id': 1, 'super_theme_id': None}, 
        {'deleted': False, 'description': 'These are neutral emotions', 'id': 6, 'name': 'Neutral emotions', 'p_id': 1, 'super_theme_id': None}
    ]
    # Post request
    response = request_handler.get("/theme/search", {"p_id": 1, "search_words": "emotions"}, True)
    # Check if search was successfull
    assert response.status_code == 200
    assert response.json == search_info

def test_theme_visual(app, client):
    """
    Function to test whether the search theme route gives correct errors and information
    """

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # When p_id is not given
    response = request_handler.get("/theme/themeVisData", {}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400

    # Visualization info
    vis_info = {'children': [
            {'children': [{'children': [{'id': 11, 'name': 'SQL', 'type': 'Label', 'deleted': False}], 'id': 7, 'name': 'Database technology', 'type': 'Theme', 'deleted': False}, {'id': 11, 'name': 'SQL', 'type': 'Label', 'deleted': False}, {'id': 13, 'name': 'Flask', 'type': 'Label', 'deleted': False}], 'id': 3, 'name': 'Backend technology', 'type': 'Theme', 'deleted': False}, 
            {'id': 8, 'name': 'Empty theme', 'type': 'Theme', 'deleted': False}, 
            {'children': [{'id': 10, 'name': 'Angular', 'type': 'Label', 'deleted': False}, {'id': 12, 'name': 'HTML', 'type': 'Label', 'deleted': False}], 'id': 4, 'name': 'Frontend technologies', 'type': 'Theme', 'deleted': False}, 
            {'children': [{'id': 2, 'name': 'Sad', 'type': 'Label', 'deleted': False}, {'id': 4, 'name': 'Angry', 'type': 'Label', 'deleted': False}, {'id': 5, 'name': 'Frustracted', 'type': 'Label', 'deleted': False}, {'id': 6, 'name': 'Scared', 'type': 'Label', 'deleted': False}, {'id': 7, 'name': 'Sleepy', 'type': 'Label', 'deleted': False}, {'id': 16, 'name': 'Dissapointed', 'type': 'Label', 'deleted': False}], 'id': 2, 'name': 'Negative emotions', 'type': 'Theme', 'deleted': False}, 
            {'id': 6, 'name': 'Neutral emotions', 'type': 'Theme', 'deleted': False}, 
            {'children': [{'id': 8, 'name': 'Curious', 'type': 'Label', 'deleted': False}, {'id': 29, 'name': 'Fun life emotions', 'type': 'Label', 'deleted': False}], 'id': 1, 'name': 'Positive emotions', 'type': 'Theme', 'deleted': False}, 
            {'children': [{'id': 14, 'name': 'Laptop', 'type': 'Label', 'deleted': False}, {'id': 15, 'name': 'Software', 'type': 'Label', 'deleted': False}], 'id': 5, 'name': 'Technology', 'type': 'Theme', 'deleted': False}, 
            {'id': 9, 'name': 'Docker', 'type': 'Label', 'deleted': False}, 
            {'id': 3, 'name': 'Excited', 'type': 'Label', 'deleted': False}, 
            {'id': 1, 'name': 'Happy', 'type': 'Label', 'deleted': False}, 
            {'id': 17, 'name': 'New Technology', 'type': 'Label', 'deleted': False}
        ], 'id': 1, 'name': 'Project 1', 'type': 'Project', 'deleted': False}
    # Post request
    response = request_handler.get("/theme/themeVisData", {"p_id": 1}, True)
    # Check if visualazation data was gotten successfull
    assert response.json == vis_info
    assert response.status_code == 200

def test_get_theme_label_count(app, client):
    """
    Function to test wether the get_theme_label_count function gives correct information
    """

    # app contect for database use
    with app.app_context():
        # Check get_theme_label_count function
        assert get_theme_label_count(1) == 2
        assert get_theme_label_count(2) == 6

def test_make_labels(app, client):
    """
    Function to test wether the make_labels function gives correct information
    """

    # app contect for database use
    with app.app_context():

        # Info for creating labels
        labels_info = [
            {"id": 1, "name": "Happy"},
            {"id": 2, "name": "Sad"},
            {"id": 3, "name": "Excited"}
        ]
        # Get the theme we want to add these labels to
        theme = db.session.get(Theme, 1)
        # Add the labels to the theme
        make_labels(theme, labels_info, 1, 1)
        # Get the added labels
        labels = db.session.scalars(select(Label).where(Label.id.in_([1,2,3]))).all()
        # Check if the labels were added
        assert theme.labels == labels

def test_make_sub_themes(app, client):
    """
    Function to test wether the make_sub_themes function gives correct information
    """

    # app contect for database use
    with app.app_context():
        # Info for creating sub-themes
        sub_themes_info = [
            {"id": 2, "name": "Negative emotions"},
            {"id": 3, "name": "Backend technology"},
            {"id": 4, "name": "Frontend technologies"}
        ]
        # Get the theme we want to add these labels to
        theme = db.session.get(Theme, 1)
        # Add the labels to the theme
        make_sub_themes(theme, sub_themes_info, 1, 1)
        # Get the added labels
        sub_themes = db.session.scalars(select(Theme).where(Theme.id.in_([2,3,4]))).all()
        # Check if the labels were added
        assert theme.sub_themes == sub_themes
    
def test_theme_name_taken(app, client):
    """
    Function to test wether the theme_name_taken function gives correct information
    """

    # app contect for database use
    with app.app_context():
        # Check if new name is not taken
        assert theme_name_taken("New name", 1) == False
        # Check if current name is not taken
        assert theme_name_taken("Positive emotions", 1) == False
        # Check if taken name is taken
        assert theme_name_taken("Positive emotions", 2) == True

def test_get_project_hierarchy(app, client):
    """
    Function to test wether the get_project_hierarchy function gives correct information
    """

    # app contect for database use
    with app.app_context():
        # Check that no hierarchy is given for none-existing project
        assert get_project_hierarchy(0) == None

        # Check hierarchy of project 1
        project_hierarchy = {'id': 1, 'name': 'Project 1', 'deleted': False, 'type': 'Project', 'children': [
            {'id': 3, 'name': 'Backend technology', 'deleted': False, 'type': 'Theme', 'children': [
                {'id': 7, 'name': 'Database technology', 'deleted': False, 'type': 'Theme', 'children': [
                    {'id': 11, 'name': 'SQL', 'deleted': False, 'type': 'Label'}]}, 
                {'id': 11, 'name': 'SQL', 'deleted': False, 'type': 'Label'}, 
                {'id': 13, 'name': 'Flask', 'deleted': False, 'type': 'Label'}]}, 
            {'id': 8, 'name': 'Empty theme', 'deleted': False, 'type': 'Theme'}, 
            {'id': 4, 'name': 'Frontend technologies', 'deleted': False, 'type': 'Theme', 'children': [
                {'id': 10, 'name': 'Angular', 'deleted': False, 'type': 'Label'}, 
                {'id': 12, 'name': 'HTML', 'deleted': False, 'type': 'Label'}]}, 
            {'id': 2, 'name': 'Negative emotions', 'deleted': False, 'type': 'Theme', 'children': [
                {'id': 2, 'name': 'Sad', 'deleted': False, 'type': 'Label'}, 
                {'id': 4, 'name': 'Angry', 'deleted': False, 'type': 'Label'}, 
                {'id': 5, 'name': 'Frustracted', 'deleted': False, 'type': 'Label'}, 
                {'id': 6, 'name': 'Scared', 'deleted': False, 'type': 'Label'}, 
                {'id': 7, 'name': 'Sleepy', 'deleted': False, 'type': 'Label'}, 
                {'id': 16, 'name': 'Dissapointed', 'deleted': False, 'type': 'Label'}]}, 
            {'id': 6, 'name': 'Neutral emotions', 'deleted': False, 'type': 'Theme'}, 
            {'id': 1, 'name': 'Positive emotions', 'deleted': False, 'type': 'Theme', 'children': [
                {'id': 8, 'name': 'Curious', 'deleted': False, 'type': 'Label'}, 
                {'id': 29, 'name': 'Fun life emotions', 'deleted': False, 'type': 'Label'}]}, 
            {'id': 5, 'name': 'Technology', 'deleted': False, 'type': 'Theme', 'children': [
                {'id': 14, 'name': 'Laptop', 'deleted': False, 'type': 'Label'}, 
                {'id': 15, 'name': 'Software', 'deleted': False, 'type': 'Label'}]}, 
            {'id': 9, 'name': 'Docker', 'deleted': False, 'type': 'Label'}, 
            {'id': 3, 'name': 'Excited', 'deleted': False, 'type': 'Label'}, 
            {'id': 1, 'name': 'Happy', 'deleted': False, 'type': 'Label'}, 
            {'id': 17, 'name': 'New Technology', 'deleted': False, 'type': 'Label'}]}
        assert get_project_hierarchy(1) == project_hierarchy