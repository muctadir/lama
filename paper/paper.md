---
title: 'LaMa: a thematic labelling web application'

tags:
- Labelling
- Qualitative data analysis
- Thematic analysis

authors:
- name: Victoria Bogachenkova 
  affiliation: 1
  equal-contrib: true

- name: Eduardo Costa Martins 
  affiliation: 1
  equal-contrib: true
  
- name: Jarl Jansen 
  affiliation: 1
  equal-contrib: true

- name: Ana-Maria Olteniceanu
  affiliation: 1

- name: Bartjan Henkemans 
  affiliation: 1

- name: Chinno Lavin
  affiliation: 1

- name: Linh Nguyen
  affiliation: 2

- name: Thea Bradley 
  affiliation: 1

- name: Veerle Fürst
  affiliation: 1

- name: Hossain Muhammad Muctadir
  email: h.m.muctadir@tue.nl
  affiliation: 1
  orcid: 0000-0002-2090-4766
  corresponding: true

- name: Mark van den Brand
  affiliation: 1
  orcid: 0000-0003-3529-6182
  email: m.g.j.v.d.brand@tue.nl

- name: Loek Cleophas
  affiliation: 1
  orcid: 0000-0002-7221-3676
  email: l.g.w.a.cleophas@tue.nl

- name: Alexander Serebrenik
  affiliation: 1
  orcid: 0000-0002-1418-0095
  email: a.serebrenik@tue.nl

affiliations:
- name: Software Engineering and Technology cluster, Eindhoven University of Technology, Eindhoven, The Netherlands
  index: 1
- name: McGill University, Montreal, Canada
  index: 2

date: 10 January 2022
bibliography: paper.bib
---

# Summary

Qualitative analysis of data is relevant for a variety of domains including empirical research studies and social science. While performing qualitative analysis of large textual data sets such as data from interviews, surveys, mailing lists, and code repositories, condensing pieces of data into a set of terms or keywords simplifies analysis, and helps in obtaining useful insight. This condensation of data can be achieved by associating keywords “labels” with text fragments, i.e., “artifacts”. It is essential during this type of research to achieve greater accuracy, facilitate collaboration, build consensus, and limit bias. LaMa, short for Labelling Machine, is an open-source web application developed for aiding in thematic analysis of qualitative data. The application facilitates cooperation through allowing simultaneous analysis by multiple researchers, and consensus building through conflict resolution techniques. The source code is available at <https://github.com/muctadir/lama>.

# Statement of need

Analyzing qualitative data has been proven to be labor intensive and time consuming task [@analysing_qual_data] due to its nature. Thematic analysis [@thematic_analysis] is a powerful yet flexible method for performing such analysis. Analyzing textual data through this method allows a researcher to understand experiences and thoughts, as well as emotions and behaviors throughout a data set. Due to the flexibility of this analysis method the users are not bound to using only one paradigmatic perspective but within different data sets can use different ones [@clarke_psych].

As thematic analysis is a widely used qualitative analysis technique, several commercial tools are available, such as Atlas.ti^[https://atlasti.com/] and maxQDA^[https://www.maxqda.com/]. Although these tools are very well developed, there are three major drawbacks that inspired the development of LaMa.

- __Commercial tool:__ As these are commercial tools, their services are not free and can be quite expensive depending on the subscription.

- __Data access and privacy:__ Qualitative research often processes sensitive data, such as legally protected information, private information of individuals. With rising privacy concerns, increasing number of research organizations are requiring specialized approval for working with such data. For example, at Eindhoven University of Technology it is mandatory, among other information, to specify which individuals can have access to the research data. This information can not be provided for commercial tools, such as the ones mentioned earlier, as they have varied data storage solutions. This greatly influenced the development of LaMa as it can be deployed locally under organizational infrastructure preventing outside access while allowing collaborative labeling, which is explained in the next section.

- __Complex collaboration workflow:__

LaMa is an web application intended to support the thematic analysis. The tool is built based on an existing application called the Labeling Machine [@labeling_machine], which is forked from the original Labeling Machine [@labeling_machine_orig], and significantly expands its functionality, as described in the Key features section.

As thematic analysis is a widely used qualitative analysis technique, several commercial tools are available, such as Atlas.ti^[https://atlasti.com/] and maxQDA^[https://www.maxqda.com/]. In addition to being an open-source alternative, LaMa facilitates thematic analysis through features such as artifact based collaborative labelling, grouping of labels into themes, and private installation with complete control over research data. With the help of this tool thematic analysis becomes less time consuming and more structured due to the flow that the tool enforces.

# Key features

LaMa in its core functionality is similar to comparable labelling tools for qualitative analysis, however a number of key features ensure greater consensus & collaboration between users and provide additional insight.

- __Open source and locally deployable:__

- __Artifact based labelling:__ LaMa uses an artifact based approach for labelling. An artifact is a short text that contains one key message and can potentially be labeled with one label. If the labeler thinks the corresponding artifact contains multiple messages, he/she can split the artifact accordingly during the labelling process.

- __Collaborative labelling:__ With LaMa multiple researchers can simultaneously label same set of text artifacts. During labelling newly created labels are immediately shared with other labelers, which facilitates the reuse of existing labels. Furthermore, a LaMa project can be configured in such a way that required one artifact to be labeled by more than one labeler to reduce individual bias.

- __Conflict resolution:__ To ensure consensus during collaboration automatic conflict detection has been implemented. A conflict occurs when one artifact is labeled differently by multiple labelers. LaMa users can view these disagreements, which facilitates a dialog among corresponding labelers to agree on a label. This is very important for reducing individual bias during the labelling process.

- __Themes:__ Lama allows users to group labels into themes, thereby providing a way of classifying data and the analysis of the data. Furthermore, themes can be categorized hierarchically further aiding in the analysis and classification process.

- __Traceability:__ LaMa keeps a record of all the changes made to the artifacts, labels and themes. These changes are visible on the details page of the corresponding entities. This adds an extra layer of traceability.

- __Visualizing hierarchy:__ To obtain insight into how artifacts are mapped to labels, and labels ordered into themes, a visualization of the hierarchy can be constructed on demand.

# Conclusion and future work

LaMa is an open-source web-application for thematic labelling of qualitative data. Its key-asset is obtaining insight into data by hierarchically grouping them into labels and themes. This is further aided by facilitating better collaboration between users through features such as collaborative labelling and conflict resolution.

We hope LaMa being an open-source tool and it's provided features can aid future qualitative research. Meanwhile, we plan to extend this tool by creating a more intuitive user experience and adding features such as document-based labelling, AI-based assistance, and labelling of audio, video & images.

# Acknowledgements

This project was partially funded by NWO (the Dutch national research council) under the NWO AES Perspective program (Digital Twin), project code P18-03 P3.

# References