# LaMa (Labelling Machine)

![LaMa logo](/frontend/assets/lama_nobg.png)
===
LaMa is a Thematic Labelling web application that can be used by multiple users to analyse and label artifacts. This tool was developed by a team of 9 students for the Final Bachelor Project at the Eindhoven University of Technology.

The tool was created to facilitate collaboration and peer feedback on labelled artifacts. Additionally, it provides a cheaper option compared to its competitors, such as [Atlas.ti](https://atlasti.com/) and [maxQDA](https://www.maxqda.com/). LaMa allows for the user to label text in order to find patterns in qualitative data. Using this tool will allow for an easier, faster, and more structured way for one or more people to label a given text and resolve any conflicts that arise between labels.

This project builds upon the already existing [Labeling Machine tool](https://github.com/muctadir/labeling-machine) by extending it and adding new functionalities, which include but are not limited to a new API and remaking the User Interface (UI).

## Table of Content
1. [Dependencies](#dependencies)
2. [Installation](#installation)
3. [User Manual](#user_manual)
4. [Testing](#testing)
5. [Contributions](#contributions)

## <a name="dependencies"></a>Dependencies
For deployment using docker:
1. [Docker](https://www.docker.com/) ≥ 20.10 (with compose plugin)
2. [Git](https://git-scm.com/) ≥ 2.37.0

For development these are the dependencies/tools without which LaMa may not work:
1. [NodeJS](https://nodejs.org/en/) ≥ 16.15
2. [Python](https://www.python.org/) ≥ 3.10
4. pip ≥ 22.1.2
5. [Docker](https://www.docker.com/) ≥ 20.10 (with compose plugin)
6. IDE (optional, but recommended for easier development)

## <a name="installation"></a>Installation
Assuming that you have all the necessary dependencies installed.
1. Clone repository
2. Navigate to the repository in a terminal
3. On Windows run:
```
.\start-win.ps1
```
On Linux run:
```
.\start-linux.sh
```

You should now have LaMa running in your browser.

### Environment variables

## <a name="user_manual"></a>User Manual

### Participating in project
Projects are the fundamental building block of the tool, functionalities are on a per project basis. There are 2 ways to participate in a project:
* Create your own project
* Join an existing project

Creating a project can be done through the **Create project** button at the top right of the screen, this opens a menu in which settings of the project can be configured. 
![alt text](https://github.com/muctadir/lama/blob/main/images/home-page-user-to-create-project.png?raw=true)

To join an existing project the project admin of that project needs to add your account through the **project setting menu** of the project. The project settings menu can be opened through the **setting (gear icon)** in the menu bar on the left after opening the project.

![alt text](https://github.com/muctadir/lama/blob/main/images/add-users-button.png?raw=true)

### Uploading artifacts
After participating in a project, for any functionality first artifacts have to be added. Artifacts can be added by navigating to the **Artifact management page**, from the navigation menu on the left after opening the project. On the artifact management page click the **Add artifact** button at the top right, and upload a _.txt_ file containing the artifact(s).

![alt text](https://github.com/muctadir/lama/blob/main/images/add-button.png?raw=true)

### Labelling an artifact
After having uploaded artifacts it is possible to start labelling them. Navigate using the **navigation menu** on the left to the **labelling page**. An artifact will be shown here. To label an artifact, select labels from the **dropdown menu** below the artifact text. 

![alt text](https://github.com/muctadir/lama/blob/main/images/label-type-dropdown.png?raw=true)

New labels can be created using the **add label** button above the dropdown menu. The remark text-field can be used to add comments on why a certain label was selected.

![alt text](https://github.com/muctadir/lama/blob/main/images/create-new-label.png?raw=true)

_Note: Labels have a label type, this is a way grouping of labels. To label an artifact the user should select a label from each label type. Label types are specified during the project creation, and are not adjustable afterwards._

### Conflict resolution
After different users have labelled an artifact there could be conflict between the labels that have been assigned. Artifacts with different labels appear in the **conflict resolution page**. Here users can modify the labeling given to ensure that there is conformity between the assigned labels. 

![alt text](https://github.com/muctadir/lama/blob/main/images/change-label.png?raw=true)

Clicking the **resolve conflict** button will resolve the conflict if the labels are consistent.

![alt text](https://github.com/muctadir/lama/blob/main/images/resolve-conflict.png?raw=true)

### Advanced features
For a full list of features we refer the reader to the **Software User Manual (SUM)**, below we will briefly describe some of the more important advanced features for common use cases.

* Artifacts can be viewed on the **artifact management page**. Additional info about labels given to artifacts can be seen by clicking on an artifact.
* Segments from an artifact can be transformed into a new artifact, this operation is referred to as **"split"**. Splitting of artifacts is done by highlighting the portion of the artifact to be split on the labelling page, and then clicking the **scissor icon** in the top right.
* The label management page displays all labels in a project, changes can be made to labels, such as editing names, merging labels.
* Themes can be created to provide a logical grouping of labels, allowing for better analysis. Themes are created on the **theme management page**. Labels are assigned to themes on the label management page, or the theme management page.
* Themes can be logically grouped with other themes to create a hierarchical view of the elements within a project.
* Artifacts, labels and themes store change history. This can be inspected by clicking the **clock icon** when viewing the aforementioned elements.
* Various project **statistics** can be viewed on the statistics page. The user can navigate to the statistics page using the navigation menu on the left side of the screen.
* The hierarchy and status of labels and themes can be visualized by clicking the **Theme hierarchy** button on the theme management page. A visualization will be displayed showing how the different elements are related to another, and their current status.

## <a name="testing"></a>Testing
### Frontend testing
1. Navigate to the frontend folder
2. Run
```
ng test
```
### Backend testing
1. Navigate to the backend folder
2. Run
```
pytest -rA
```
## <a name="contributions"></a>Contributions
The tool was created for the Final Bachelor Project at Eindhoven University of Technology by 9 students: 
- V. Bogachenkova*, 
- T. Bradley, 
- E.J. Costa Martins*, 
- V. Fürst, 
- B. Henkemans, 
- J.L.O. Jansen*, 
- L.C. Lavin, 
- L.V. Nguyen, 
- A. Olteniceanu

The project was supervised by: 
H.M. Muctadir and A.Serebrenik
