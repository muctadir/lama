All of the classes
<details><summary>Artifact (abstract class)</summary>
    <b>id:</b> number </p><br>
    <b>identifier:</b> string </p><br>
    <p>data: any </p><br>
    <p>completed: boolean (when the artifact has been completely labelled) </p><br>
    <p>labellings: Array < Array < any > > information per labelling including [username, labelname, <p>labeltype, description, remark]  </p><br>
    <p>parentId: number (parent artifact ID in case of split) </p><br>
    <p>childIds: Array < number > (child artifact IDs in case of split) </p><br>
    <p>highlighted: any (highlight info of the artifact)</p>
</details>

<details><summary>Changelog</summary>
    <b>name:</b> string </p><br>
    <b>timestamp:</b> string </p><br>
    <p>desc: string </p><br>
</details>


<details><summary>Label</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>desc:</b> string </p><br>
    <b>type:</b> string </p><br>
    <p>labelParents: Array < Label > (array containing parent labels) </p><br>
    <p>labelChildren: Array < Label > (array containing child labels) </p><br>
    <p>artifacts: Array <  StringArtifact > (array containing artifacts with the label) </p><br>
    <p>users: Array <  User > (array containing user who have used the label) </p><br>
    <p>themes: Array < Theme > (array of themes to which the label belongs) </p><br>
    <p>deleted: boolean (deletion status of the label)</p>
</details>

<details><summary>LabelType</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>labels:</b> Array < Label > </p>
</details>


<details><summary>Project</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>description:</b> string </p><br>
    <p>users: Array < User > (array of users of the project) </p><br>
    <p>numberOfArtifacts: number (number of artifacts in a) </p><br>
    <p>numberOfCLArtifacts: number (number of completely labelled artifacts in a project) </p><br>
    <p>frozen: boolean (status on if the project is frozen) </p><br>
    <p>criteria: number (number of times project artifacts have to be labelled) </p><br>
    <p>admin: boolean (if current is admin of the project) </p>
</details>

<details><summary>StringArtifact</summary>
    <b>id:</b> number </p><br>
    <b>identifier:</b> string </p><br>
    <b>data:</b> string </p><br>
    <p>completed: boolean (when the artifact has been completely labelled) </p><br>
    <p>labellings: Array < Array < any > > information per labelling including [username, labelname, <p>labeltype, description, remark]  </p><br>
    <p>parentId: number (parent artifact ID in case of split) </p><br>
    <p>childIds: Array < number > (child artifact IDs in case of split) </p><br>
    <p>highlighted: any (highlight info of the artifact) </p>
</details>

<details><summary>Theme</summary>
    <b>id:</b> number </p><br>
    <b>name:</b> string </p><br>
    <b>desc:</b> string </p><br>
    <p> themeParent: Theme  (parent theme of the theme) </p><br>
    <p> themeChildren: Array < Theme > (array of child themes of the theme) </p><br>
    <p> labels: Array < Label > (array of labels that belong to the theme) </p><br>
    <p> numberOfLabels: number (count of labels) </p><br>
    <p> deleted: boolean (deletion status of the theme) </p>
</details>

<details><summary>User</summary>
    <b>id:</b> number </p><br>
    <b>username:</b> string </p><br>
    <p>email: string </p><br>
    <p> description: string (description of the user) </p><br>
    <p> status: string (status of the user based on approval) </p><br>
    <p> type: string (user type ex: if admin) </p>
</details>


