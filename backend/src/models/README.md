All of the *concrete* models contain a \_\_tablename\_\_ attribute
<details><summary>User</summary>
    id <br>
    username <br>
    password <br>
    email <br>
    status (see UserStatus enum) <br>
    description <br>
    memberships (collection of memberships the user is associated with) <br>
    projects (collection of projects) <br>
    labellings (collection of labellings (info on how the user has labelled artifacts)) <br>
    labels (collection of labels the user has labelled an artifact with) <br>
    artifacts (collection of artifacts the user has labelled) <br>
    highlights (collection of highlights (which artifacts the user has highlighted and how)) <br>
    type (user or super_admin) <br>
    artifact_changes (collection of changes made to artifacts) <br>
    label_changes (collection of changes made to labels) <br>
    theme_changes (collection of changes made to themes)
</details>

<details><summary>SuperAdmin (Inherits User)</summary>
this exists mostly to simplify queries or to be extended later <br>
    id
</details>

<details><summary>Project</summary>
    id <br>
    name <br>
    description <br>
    criteria (number of users that need to label an artifact for it to be considered completely labelled) <br>
    frozen (cannot be edited) <br>
    memberships (collection of memberships associated with this project) <br>
    users (collection of users in this project) <br>
    artifacts (collection of artifacts in this project) <br>
    labels (collection of labels in this project) <br>
    themes (collection of themes in this project) <br>
    label_types (collection of label types in this project)
</details>

<details><summary>Membership</summary>
    p_id (project id) <br>
    u_id (user id) <br>
    admin (is user an admin in this project?) <br>
    deleted (soft deletion) <br>
    project (project object with that id) <br>
    user (user object with that id)
</details>

<details><summary>ProjectItem (Artifact/Label/Theme/LabelType)</summary>
    p_id (project id the item belongs to) <br>
    id (id of this item within the project) <br>
    name <br>
    project (the project object with that id)
</details>

<details><summary>ChangingItem (Inherits ProjectItem) (Artifact/Label/Theme)</summary>
    change_class_name (the class name of the change class associated with this item) <br>
    change_table_name (the table name of the change table associated with this item) <br>
    changes (collection of changes made to this item) <br>
    __change__ (the actual class (NOT INSTANCE) of the changes for this type of item)
</details>

<details><summary>LabelType (Inherits ProjectItem)</summary>
    labels (list of labels of this type)
</details>

<details><summary>Artifact (Inherits ChangingItem)</summary>
    identifier (artifact identifier (NOT ID)) <br>
    data (the text that is displayed) <br>
    parent_id (id of artifact this one was split from) <br>
    parent (the artifact object this one was split from) <br>
    start (start character of the split in parent artifact) <br>
    end (end character of the split in the parent artifact) <br>
    children (collection of artifacts split from this one) <br>
    labellings (collection of labellings for this artifact) <br>
    labels (collection of labels this artifact has been given) <br>
    users (collection of users that have labelled this artifact) <br>
    highlights (collection of highlights for this artifact)
</details>

<details><summary>Label (Inherits ChangingItem)</summary>
    lt_id (id of this label's label type) <br>
    label_type (LabelType object corresponding to that id) <br>
    description <br>
    deleted (soft deleted) <br>
    child_id (label id that this label was merged into) <br>
    child (label object this label was merged into) <br>
    parents (collection of label objects that were merged into this one) <br>
    labellings (collection of labellings with this label) <br>
    artifacts (collection of artifacts with this label) <br>
    users (collection of users that have used this label) <br>
    themes (collection of themes this label is assigned to)
</details>

<details><summary>Theme (Inherits ChangingItem)</summary>
    description <br>
    deleted (soft deleted) <br>
    sub_themes (collection of sub themes) <br>
    super_theme (super theme object) <br>
    labels (collection of labels assigned to this theme)
</details>

<details><summary>Labelling</summary>
    u_id (user id that made this labelling) <br>
    a_id (artifact id that was labelled) <br>
    lt_id (label type id corresponding to the label used) <br>
    l_id (label id that the artifact was labelled with) <br>
    p_id (project id that the artifact/label) <br>
    remark (why was this artifact labelled with this label?) <br>
    time (how long did it take the user to label this artifact?) <br>
    user (user object that made the labelling) <br>
    artifact (artifact object that was labelled) <br>
    label (label object that the artifact was labelled with) <br>
    label_type (short for label.label_type)
</details>

<details><summary>Highlight</summary>
    u_id (user id that made the highlight) <br>
    a_id (artifact id that was highlighted) <br>
    p_id (project id the artifact is a part of) <br>
    id (the nth highlight on this artifact by this user) <br>
    start (start character of the highlight in the artifact) <br>
    end (end character of the highlight in the artifact) <br>
    user (user object that made the highlight) <br>
    artifact (artifact object that was highlighted)
</details>

<details><summary>Change (ArtifactChange/LabelChange/ThemeChange)</summary>
    __marshmallow__ (the schema class (NOT INSTANCE) for this change class) <br>
    item_class_name (the class name of the item this change class corresponds to) <br>
    item_table_name (the table name of the item this change table corresponds to) <br>
    u_id (id of user that made this change) <br>
    user (user object that made this change) <br>
    p_id (id of project the item is a part of) <br>
    i_id (id of item within the project) <br>
    item (item object that was changed) <br>
    id (the nth change to this item by this user) <br>
    change_type (the type of change that was made, see ChangeType) <br>
    description (description of the change that was made, should be parsed based on change_type) <br>
    timestamp (DateTime object of when the change was made)
</details>