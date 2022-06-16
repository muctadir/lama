/**
   * Splitting function, gets text without splitting words and gets start and end char
   * BROKEN
   */
//  split(): void {
//   let firstCharacter = this.selectionStartChar!;
//   let lastCharacter = this.selectionEndChar!;
//   firstCharacter = this.posFixer(firstCharacter, lastCharacter)[0];
//   lastCharacter = this.posFixer(firstCharacter, lastCharacter)[1] + 1;
//   let splitText = this.artifact?.data.substring(
//     firstCharacter,
//     lastCharacter
//   );
//   alert(
//     "The text is: '" +
//       splitText +
//       "'\nThe start is at: " +
//       firstCharacter +
//       '\nThe end is at: ' +
//       lastCharacter
//   );
// }

/**
   * Gets the correct indices so that words aren't split
   * BROKEN
   */
//  posFixer(startPos: number, endPos: number) {
//   //get the chars at index
//   let chart = this.artifact?.data.charAt(startPos);
//   let chend = this.artifact?.data.charAt(endPos - 1);
//   //if you just select the space
//   if (startPos - endPos == 1) {
//     return [startPos, endPos];
//   }
//   //else we move until we hit a space
//   while (chart != ' ' && startPos != -1) {
//     chart = this.artifact?.data.charAt(startPos);
//     startPos = startPos - 1;
//   }
//   while (chend != ' ' && endPos != this.artifact?.data.length) {
//     chend = this.artifact?.data.charAt(endPos);
//     endPos++;
//     console.log(chend, endPos);
//   }
//   //last adjustements from going too far
//   startPos = startPos + 2;
//   endPos = endPos - 2;
//   return [startPos, endPos];
// }


  /**
   * Function is ran on mouseDown or mouseUp and updates the current selection
   * of the artifact. If the selection is null or empty, the selection is set
   * to ""
   * BROKEN
   */
  //  selectedText(): void {
  //   let hightlightedText: Selection | null = document.getSelection();
  //   //gets the start and end indices of the highlighted bit
  //   let startCharacter: number = hightlightedText?.anchorOffset!;
  //   let endCharacter: number = hightlightedText?.focusOffset!;
  //   //make sure they in the right order
  //   if (startCharacter > endCharacter) {
  //     startCharacter = hightlightedText?.focusOffset!;
  //     endCharacter = hightlightedText?.anchorOffset!;
  //   }
  //   //put into global variable
  //   this.selectionStartChar = startCharacter;
  //   this.selectionEndChar = endCharacter;
  //   //this is so the buttons still pop up, idk if we need it so ill ask bartgang
  //   if (hightlightedText == null || hightlightedText.toString().length <= 0) {
  //     this.hightlightedText = '';
  //   } else {
  //     this.hightlightedText = hightlightedText.toString();
  //   }
  // }
