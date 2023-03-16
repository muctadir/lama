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

Qualitative analysis of data is relevant for a variety of domains including empirical research studies and social sciences. While performing qualitative analysis of large textual data sets such as data from interviews, surveys, mailing lists, and code repositories, condensing pieces of data into a set of terms or keywords simplifies analysis, and helps in obtaining useful insight. This condensation of data can be achieved by associating keywords, a.k.a. *labels*, with text fragments, a.k.a *artifacts*. It is essential during this type of research to achieve greater accuracy, facilitate collaboration, build consensus, and limit bias. LaMa, short for Labelling Machine, is an open-source web application developed for aiding in thematic analysis of qualitative data. The source code and the documentation of the tool are available at <https://github.com/muctadir/lama>. In addition to being open-source, LaMa facilitates thematic analysis through features such as artifact based collaborative labelling, consensus building through conflict resolution techniques, grouping of labels into themes, and private installation with complete control over research data. With the help of this tool and flow it enforces, thematic analysis becomes less time consuming and more structured.

# Statement of need

Analyzing qualitative data has been proven to be labor intensive and time consuming task [@analysing_qual_data] due to its nature. Thematic analysis [@thematic_analysis] is a powerful yet flexible method for performing such analysis. Analyzing textual data through this method allows a researcher to understand experiences and thoughts, as well as emotions and behaviors throughout a data set. Due to the flexibility of this analysis method, the users are not bound to using only one paradigmatic perspective but within different data sets can use different ones [@clarke_psych].

As thematic analysis is a widely used qualitative analysis technique, several commercial tools are available, such as Atlas.ti^[https://atlasti.com/] and maxQDA^[https://www.maxqda.com/]. We also investigated open-source applications that allows labelling of artifacts such as Label Studio^[https://labelstud.io/]. Although these tools are very well developed, there are three major trade offs that inspired the development of LaMa.

- **Cost:** As these are commercial tools, their services are not free and can be quite expensive depending on the subscription.

- **Data access and privacy:** Qualitative researches often process sensitive data, such as legally protected information, private information of individuals. With rising privacy concerns, increasing number of research organizations are requiring specialized approval for working with such data. For example, at Eindhoven University of Technology it is mandatory, among other information, to specify which individuals can have access to the research data. With commercial tools, control over the access of the research data or the storage location are often unavailable.

- **Complex collaboration workflow:** Collaborative labelling or coding is an established method for reducing bias during qualitative analysis [@APracticalGuidetoCollaborativeQualitativeDataAnalysis]. While commercial tools provide this feature in various forms, the process for resolving conflicting labels is often complicated.

Based on these points we developed LaMa, which is a web application intended to support the thematic analysis and is built based on an existing application called the Labeling Machine [@labeling_machine], which is forked from the an earlier Labeling Machine [@labeling_machine_orig]. In addition to significantly improving the user interface, LaMa provides additional features such as multi-labelling, hierarchical theming, and change tracking. Its key features are described in the following section.

# Key features

LaMa in its core functionality is similar to comparable labelling tools for qualitative analysis, however a number of key features ensure greater consensus & collaboration among users and control over research data.

- **Open-source and locally deployable:** LaMa is open-source and can be deployed locally under organizational infrastructure preventing outside access while allowing collaborative labelling by researchers from an organization. This can benefit from security measures already in place at an organizational level, allow more control over research data, and reduce the possibility of data leakage. Furthermore, due to its open-source nature, the tool can be adapted based on specialized needs.

- **Artifact based labelling:** LaMa uses an artifact based approach for labelling. An artifact is a short text that contains one key message and can potentially be labeled with one label. If the labeler thinks the corresponding artifact contains multiple messages, he/she can split the artifact accordingly during the labelling process.

- **Collaborative labelling:** With LaMa multiple researchers can simultaneously label same set of text artifacts. During labelling newly created labels are immediately shared with other labelers, which facilitates the reuse of existing labels. Furthermore, a LaMa project can be configured so that it requires one artifact to be labeled by more than one labeler to reduce individual bias.

- **Multi labelling:** LaMa allows each artifact to be labelled with multiple labels. This feature is particularly useful if a researcher wants to label an artifact from more then one viewpoints. These viewpoints, which are called label types, can be configured during project creation.

- **Conflict resolution:** To ensure consensus during collaboration, automatic conflict detection has been implemented. A conflict occurs when one artifact is labeled differently by multiple labelers. LaMa users can view these disagreements, which facilitates a dialog among corresponding labelers to agree on a label. Having this dialog and resolving the disagreement are very important for reducing individual bias during the labelling process.

- **Themes:** LaMa allows users to group labels into themes, thereby providing help in the classification and the analysis of the data. Furthermore, themes can be categorized hierarchically further aiding in the analysis and classification process.

- **Traceability:** LaMa keeps a record of all the changes made to the artifacts, labels and themes. These changes are visible on the details page of the corresponding entities. This adds an extra layer of traceability.

# Conclusion and future work

LaMa is an open-source web-application for thematic labelling of qualitative data. Its key-assets are obtaining insight into data by hierarchically grouping them into labels & themes and facilitating better collaboration between users through features such as collaborative labelling & conflict resolution.

LaMa has been extremely beneficial for analyzing the data of an ongoing semi-structured interview research. We hope that LaMa can aid future qualitative research by the features it provides and by being extendible due to its open-source nature. Meanwhile, we plan to extend this tool by creating a more intuitive user experience and adding features such as document-based labelling, AI-based assistance, and labelling of audio, video & images.

# Acknowledgements

This project was partially funded by NWO (the Dutch national research council) under the NWO AES Perspective program (Digital Twin), project code P18-03 P3.

# References