All of the classes
<details><summary>Artifact (abstract class)</summary>
    <b>id:</b> number <br>
    <b>identifier:</b> string <br>
    <b>data:</b> any <br>
    completed: boolean (when the artifact has been completely labelled) <br>
    labellings: Array\<Labelling\> (how the artifact was labelled) <br>
    start: number (start index of artifact split) <br>
    end: number (end index of artifact split) <br>
    parentId: number (parent artifact ID in case of split) <br>
    childIds: Array\<number\> (child artifact IDs in case of split) <br>
    highlighted: any (highlight info of the artifact)
</details>

<details><summary>Label</summary>
    <b>id:</b> number <br>
    <b>name:</b> string <br>
    <b>desc:</b> string <br>
    <b>type:</b> string <br>
    labelParents: Array\<Label\> (array containing parent labels) <br>
    labelChilds: Array\<Label\> (array containing child labels) <br>
    artifacts: Array\<Artifact\> (array containing artifacts with the label) <br>
    users: Array\<User\> (array containing user who have used the label) <br>
    themes: Array\<Theme\> (array of themes to which the label belongs) <br>
    deleted: boolean (deletion status of the label)
</details>

<details><summary>LabelType</summary>
    <b>id:</b> number <br>
    <b>name:</b> string <br>
    <b>labels:</b> Array\<Label\>
</details>

<details><summary>Labelling</summary>
    <b>id:</b> number <br>
    <b>name:</b> string <br>
    <b>labels:</b> Array\<any\>
</details>

<details><summary>Project</summary>
    <b>id:</b> number <br>
    <b>name:</b> string <br>
    <b>description:</b> string <br>
    users: Array\<User\> (array of users of the project) <br>
    numberOfArtifacts: number (number of artifacts in a) <br>
    numberOfCLArtifacts: number (number of completely labelled artifacts in a project) <br>
    frozen: boolean (status on if the project is frozen) <br>
    criteria: number (number of times project artifacts have to be labelled) <br>
    admin: boolean (if current is admin of the project) <br>
</details>

<details><summary>StringArtifact</summary>
    <b>id:</b> number <br>
    <b>identifier:</b> string <br>
    <b>data:</b> string <br>
    completed: boolean (when the artifact has been completely labelled) <br>
    labellings: Array<Labelling> (how the artifact was labelled) <br>
    start: number (start index of artifact split) <br>
    end: number (end index of artifact split) <br>
    parentId: number (parent artifact ID in case of split) <br>
    childIds: Array<number> (child artifact IDs in case of split) <br>
    highlighted: any (highlight info of the artifact)
</details>

<details><summary>Theme</summary>
    <b>id:</b> number <br>
    <b>name:</b> string <br>
    <b>desc:</b> string <br>
    themeParents: Array\<Theme\> (array of parent themes of the theme) <br>
    themeChilds: Array\<Theme\> (array of child themes of the theme) <br>
    labels: Array\<Label\> (array of labels that belong to the theme) <br>
    deleted: boolean (deletion status of the theme)
</details>

<details><summary>User</summary>
    <b>id:</b> number <br>
    <b>username:</b> string <br>
    <b>email:</b> string <br>
    description: string (description of the user) <br>
    status: string (status of the user based on approval) <br>
    type: string (user type ex: if admin) 
</details>


