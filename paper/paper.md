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

- name: Loek Cleophas
  affiliation: 1

- name: Alexander Serebrenik
  affiliation: 1

affiliations:
- name: Software Engineering and Technology cluster, Eindhoven University of Technology, Eindhoven, The Netherlands
  index: 1
- name: McGill University, Montreal, Canada
  index: 2

date: 10 January 2022
bibliography: paper.bib
---

# Summary

Qualitative analysis of data is relevant for a variety of domains including empirical research studies. While performing qualitative analysis of large textual data sets such as data from StackOverflow, Apache Mailing Lists, and GitHub issues, condensing pieces of data into a set of terms or keywords simplifies analysis, and helps in obtaining useful insight. This condensation of data can be achieved by associating keywords “labels” with text fragments “artifacts”. To achieve greater accuracy, and limit bias, collaboration and consensus building is essential during such research activities. LaMa, which is a short form for Labelling Machine, is an open-source web application for thematic labelling of qualitative data. The application facilitates cooperation through allowing simultaneous analysis by multiple researchers, and consensus building through conflict resolution techniques. The source code is available at: <https://github.com/muctadir/lama>.

# Statement of need

As mentioned previously, LaMa is a thematic labeling tool. The tool is built based on an existing application called the Labeling Machine [@labeling_machine] and significantly expands its functionality, as described in the Key features section.

Analysing qualitative data has been proven to be a labor intensive and time consuming [@analysing_qual_data] due to its nature. Thematic analysis is a ‘powerful yet flexible method for analysing qualitative data’ [@thematic_analysis]. Analysing textual data through this method allows the user to understand experiences and thoughts, as well as emotions and behaviors throughout a data set. Due to the flexibility of this analysis method the users are not bound to using only one paradigmatic perspective but within different data sets can use different ones [@clarke_psych].

As thematic analysis is a widely used qualitative analysis technique, several commercial tools, such as Atlas.ti [@atlas.ti]  and maxQDA [@maxqda_2022], are available that provides support for such research. In addition to being an open-source alternative, LaMa facilitates thematic analysis through its unique features such as artifact based collaborative labeling, grouping of labels into themes, and private installation with complete control over research data. With the help of this tool thematic analysis becomes less time consuming and more structured due to the flow that the tool enforces.

# Key features

LaMa is in its core functionality similar to comparable labelling tools for qualitative analysis, however a number of key features ensure greater consensus and collaboration between users, as well as provide additional insight compared to existing labelling tools.

- __Artifact based labeling:__ LaMa uses an artifact based approach for labeling. An artifact is a short text that contains one key message and can potentially be labeled with one label. If the labeler thinks the corresponding artifact contains multiple messages, he/she can split the artifact accordingly during the labeling process.

- __Collaborative labeling:__ With LaMa multiple researchers can simultaneously label same set of text artifacts. During labeling newly created labels are immediately shared with other labelers, which facilitates the reuse of existing labels. Furthermore, a LaMa project can be configured in such a way that required one artifact to be labeled by more than one labeler to reduce individual bias.

- __Conflict resolution:__ To ensure consensus during collaboration automatic conflict detection has been implemented. A conflict occurs when one artifact is labeled differently by multiple labelers. With LaMa users can view these disagreements that facilitates a dialog among corresponding labelers to agree on a label. This is very important for reducing individual bias during the labeling process.

- __Themes:__ Lama allows users to group labels into themes, thereby providing a way of classifying data and the analysis of the data. Furthermore, themes can be categorized hierarchically further aiding in the analysis and classification process.

- __Traceability:__ LaMa keeps a record of all the changes made to the artifacts, labels and themes. These changes are visible on the details page of the corresponding entities. This adds an extra layer of traceability.

- __Visualizing hierarchy:__ To obtain insight into how artifacts are mapped to labels, and labels ordered into themes, a visualization of the hierarchy can be constructed on demand.


# Conclusion and future work



# Acknowledgements

This project was partially funded by NWO (the Dutch national research council) under the NWO AES Perspective program (Digital Twin), project code P18-03 P3.
