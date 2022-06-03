import { Component, OnInit } from '@angular/core';

//Test array for label holding artifacts

@Component({
  selector: 'app-single-theme-view',
  templateUrl: './single-theme-view.component.html',
  styleUrls: ['./single-theme-view.component.scss']
})
export class SingleThemeViewComponent implements OnInit {

  //Theme Name Variable
  themeName: String = 'Theme 1';

  themeDescription: String = 'Lorem ipsum dolor sit amet. Et beatae sint ut unde architecto cum esse sequi in sapiente temporibus vel cupiditate amet ut omnis ipsum. 33 eius consequatur aut nemo asperiores et recusandae dolore. Qui voluptatem amet non voluptate error id facilis voluptas ad quod commodi ut rerum officiis eum minus dolores. Et quisquam earum sed quas saepe est nesciunt corporis aut aliquid galisum.';

  //HardCoded Parent-Themes
  parentTheme = ['Emotional'];

  //HardCoded Sub-Themes
  subThemes = ['Happiness','Humor'];

  //Hard Coded Labels
  allLabels = [{labelName:'Happy',
  labelDescription:'This label is used for any text that give off a general positive feeling of happiness or anything similar.',
  labelArtifacts: [{artifactName: 'Artifact 1', artifactText: 'Lorem ipsum dolor sit amet. Et beatae sint ut unde architecto cum esse sequi in sapiente temporibus vel cupiditate amet ut omnis ipsum. 33 eius consequatur aut nemo asperiores et recusandae dolore. Qui voluptatem amet non voluptate error id facilis voluptas ad quod commodi ut rerum officiis eum minus dolores. Et quisquam earum sed quas saepe est nesciunt corporis aut aliquid galisum.', artifactRemark: 'I thought that this is the best thing ever.'},
                   {artifactName: "Artifact 2", artifactText: 'The quick brown fox jumps over the lazy sleeping dog', artifactRemark: 'I thought that this is the second best thing ever.'}]},
                   {labelName:'Humor',
  labelDescription:'This label is used for any text that give off a funny feeling or anything similar.',
  labelArtifacts: [{artifactName: 'Artifact 1', artifactText: 'Lorem ipsum dolor sit amet. Et beatae sint ut unde architecto cum esse sequi in sapiente temporibus vel cupiditate amet ut omnis ipsum. 33 eius consequatur aut nemo asperiores et recusandae dolore. Qui voluptatem amet non voluptate error id facilis voluptas ad quod commodi ut rerum officiis eum minus dolores. Et quisquam earum sed quas saepe est nesciunt corporis aut aliquid galisum.', artifactRemark: 'I thought that this was suitable because...'},
                   {artifactName: "Artifact 3", artifactText: 'The man made a funny joke about a cat', artifactRemark: 'I thought that this made sense.'}]}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }

}
