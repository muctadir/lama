All of the classes
<details><summary>Artifact (abstract class)</summary>
    <b>id:</b> number </p><br>
    <b>identifier:</b> string </p><br>
    <b>data:</b> any </p><br>
    completed: boolean (when the artifact has been completely labelled) </p><br>
    labellings: Array < Labelling > (how the artifact was labelled) </p><br>
    start: number (start index of artifact split) </p><br>
    end: number (end index of artifact split) </p><br>
    parentId: number (parent artifact ID in case of split) </p><br>
    childIds: Array < number > (child artifact IDs in case of split) </p><br>
    highlighted: any (highlight info of the artifact)
</details>

<details><summary>Label</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>desc:</b> string </p><br>
    <b>type:</b> string </p><br>
    labelParents: Array < Label > (array containing parent labels) </p><br>
    labelChilds: Array < Label > (array containing child labels) </p><br>
    artifacts: Array <  Artifact > (array containing artifacts with the label) </p><br>
    users: Array <  User > (array containing user who have used the label) </p><br>
    themes: Array < Theme > (array of themes to which the label belongs) </p><br>
    deleted: boolean (deletion status of the label)
</details>

<details><summary>LabelType</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>labels:</b> Array < Label > 
</details>

<details><summary>Labelling</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>labels:</b> Array < any > 
</details>

<details><summary>Project</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>description:</b> string </p><br>
    users: Array < User > (array of users of the project) </p><br>
    numberOfArtifacts: number (number of artifacts in a) </p><br>
    numberOfCLArtifacts: number (number of completely labelled artifacts in a project) </p><br>
    frozen: boolean (status on if the project is frozen) </p><br>
    criteria: number (number of times project artifacts have to be labelled) </p><br>
    admin: boolean (if current is admin of the project) </p><br>
</details>

<details><summary>StringArtifact</summary>
    <b>id:</b> number </p><br>
    <b>identifier:</b> string </p><br>
    <b>data:</b> string </p><br>
    <p> completed: boolean (when the artifact has been completely labelled) </p> </p><br>
    <p> labellings: Array < Labelling > (how the artifact was labelled) </p><br>
    <p> start: number (start index of artifact split) </p><br>
    <p> end: number (end index of artifact split) </p><br>
    <p> parentId: number (parent artifact ID in case of split) </p><br>
    <p> childIds: Array < number > (child artifact IDs in case of split) </p><br>
    <p> highlighted: any (highlight info of the artifact) </p>
</details>

<details><summary>Theme</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>desc:</b> string </p><br>
    <p> themeParents: Array < Theme > (array of parent themes of the theme) </p><br>
    <p> themeChilds: Array < Theme > (array of child themes of the theme) </p><br>
    <p> labels: Array < Label > (array of labels that belong to the theme) </p><br>
    <p> deleted: boolean (deletion status of the theme) </p>
</details>

<details><summary>User</summary>
    <b>id:</b> number </p><br>
    <b>username:</b> string </p><br>
    <b>email:</b> string </p><br>
    <p> description: string (description of the user) </p><br>
    <p> status: string (status of the user based on approval) </p><br>
    <p> type: string (user type ex: if admin) </p>
</details>


