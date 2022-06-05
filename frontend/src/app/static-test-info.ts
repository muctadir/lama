import { Label } from "app/classes/label";
import { LabelType } from "app/classes/label-type";
import { StringArtifact } from "app/classes/stringartifact";

export const artifact: StringArtifact = new StringArtifact(
    1, "X0UT5", "In proident aliquip tempor ullamco ut Lorem duis tempor. Non consequat nostrud in commodo ullamco laborum ad et ipsum do.");



export const labels: Array<LabelType> = new Array<LabelType>(
    new LabelType(1, "Ex dolore aute anim adipisicing commodo officia mollit enim est id sunt enim eu velit consequat.", 
        new Array<Label>(
            new Label(0, "incididunt", "Commodo nisi amet irure excepteur officia et irure aute et.", "lorem"), 
            new Label(1, "eiusmod", "Consequat do eiusmod magna sit sit in minim aute aute sint cillum pariatur ut adipisicing.", "ipsum")
        )
    ),
    new LabelType(2, "Ex dolore aute anim adipisicing commodo officia mollit enim est id sunt enim eu velit consequat.", 
        new Array<Label>(
            new Label(2, "incididunt", "Commodo nisi amet irure excepteur officia et irure aute et.", "lorem"), 
            new Label(3, "eiusmod", "Consequat do eiusmod magna sit sit in minim aute aute sint cillum pariatur ut adipisicing.", "ipsum")
        )
    )
)

/**
 * This is some randomly generated data. I could not be arsed to put it all in.
 */
// [
//     {
//       "labelTypeName": "sunt",
//       "labelTypeDescription": "Ex dolore aute anim adipisicing commodo officia mollit enim est id sunt enim eu velit consequat. Occaecat quis pariatur eu ad qui cillum dolore. Exercitation id ex ea incididunt aute occaecat do veniam ipsum irure. Nulla aliqua commodo laborum magna ipsum aliqua exercitation. Consequat enim qui occaecat culpa ullamco culpa officia irure tempor cillum mollit do mollit ad.",
//       "labels": [
//         {
//           "labelID": "0",
//           "labelName": "incididunt",
//           "labelDescription": "Commodo nisi amet irure excepteur officia et irure aute et. Magna Lorem magna laborum culpa anim nulla cillum proident. Laboris Lorem mollit aliqua adipisicing. Tempor est commodo labore nisi sint esse do consectetur occaecat reprehenderit sunt amet consequat voluptate.",
//           "nArtifact": 5,
//           "deleted": false
//         },
//         {
//           "labelID": "1",
//           "labelName": "eiusmod",
//           "labelDescription": "Consequat do eiusmod magna sit sit in minim aute aute sint cillum pariatur ut adipisicing. Laborum commodo dolore labore adipisicing pariatur ut elit enim eiusmod dolore fugiat adipisicing. Culpa commodo cupidatat nulla culpa do pariatur sint non proident ad ad commodo Lorem aute exercitation. Excepteur veniam officia elit aliquip velit. Exercitation fugiat est irure deserunt dolor exercitation ex veniam officia culpa aliqua. Quis reprehenderit magna incididunt mollit cillum est mollit consectetur et qui mollit veniam.",
//           "nArtifact": 4,
//           "deleted": false
//         },
//         {
//           "labelID": "2",
//           "labelName": "pariatur",
//           "labelDescription": "Ex nostrud excepteur culpa. Ad magna irure excepteur commodo minim anim in enim exercitation deserunt nostrud id aliquip culpa officia. Eu anim quis dolor laboris occaecat nostrud nulla ad ipsum quis velit exercitation. Est exercitation et ex occaecat consectetur commodo non. Pariatur veniam laborum dolore fugiat in qui qui.",
//           "nArtifact": 3,
//           "deleted": false
//         }
//       ]
//     },
//     {
//       "labelTypeName": "consectetur",
//       "labelTypeDescription": "Deserunt anim anim eiusmod fugiat labore eu veniam non ipsum non dolor eu. Veniam reprehenderit aute pariatur sit eu exercitation fugiat. Nisi esse anim laborum qui ullamco. Laborum consequat aliqua nostrud laboris. Culpa cupidatat sint et proident ad.",
//       "labels": [
//         {
//           "labelID": "0",
//           "labelName": "et",
//           "labelDescription": "Tempor ut laboris officia cillum occaecat adipisicing nulla non occaecat sint eu dolore dolor. Aliquip non dolore magna ex occaecat do voluptate laborum cillum ad ipsum velit. Anim mollit ea incididunt exercitation laboris enim in sint voluptate anim fugiat adipisicing. Minim sunt incididunt exercitation exercitation et. Consequat id voluptate nostrud ipsum nulla ex eiusmod laborum quis sit voluptate magna laborum. Nostrud culpa ex duis sint dolor qui. Ut exercitation ullamco qui sunt culpa cupidatat ea deserunt deserunt. Do Lorem et aute excepteur excepteur voluptate.",
//           "nArtifact": 7,
//           "deleted": false
//         },
//         {
//           "labelID": "1",
//           "labelName": "fugiat",
//           "labelDescription": "Velit cupidatat duis non nisi amet ad qui dolor ullamco sit. Nisi excepteur exercitation sunt esse amet proident fugiat. Pariatur qui nisi amet excepteur id sit magna velit et ad proident. Commodo adipisicing et duis commodo amet sint consequat minim minim nostrud do. Adipisicing voluptate enim irure sunt ea commodo occaecat ut fugiat proident sunt aliquip et.",
//           "nArtifact": 9,
//           "deleted": false
//         },
//         {
//           "labelID": "2",
//           "labelName": "reprehenderit",
//           "labelDescription": "Adipisicing ad dolor id. Exercitation dolor qui nisi ut aute consequat consequat. Ipsum voluptate ex Lorem aute labore sunt aliqua ullamco aliquip qui commodo ut amet. Veniam consectetur sint qui ipsum velit. Et minim enim nisi. Reprehenderit voluptate aliqua laborum anim enim id do elit. Eu laboris excepteur enim cupidatat adipisicing cillum. Id proident mollit commodo ipsum labore minim consequat ullamco fugiat proident ullamco magna eiusmod reprehenderit.",
//           "nArtifact": 3,
//           "deleted": false
//         },
//         {
//           "labelID": "3",
//           "labelName": "id",
//           "labelDescription": "Pariatur amet esse consectetur sunt do cillum ullamco do eiusmod enim commodo in. Do Lorem culpa quis ullamco occaecat. Cillum eiusmod ipsum irure. Consectetur consectetur reprehenderit voluptate amet ipsum cupidatat sit aute elit nisi non exercitation magna. Nostrud est labore eu magna consectetur. Ipsum ad Lorem eiusmod est aute qui quis est. Laboris ad consequat eiusmod magna velit veniam proident et laboris eiusmod aliquip. Ut cillum pariatur anim anim magna dolore aliqua.",
//           "nArtifact": 7,
//           "deleted": false
//         }
//       ]
//     },
//     {
//       "labelTypeName": "sit",
//       "labelTypeDescription": "Exercitation nostrud incididunt nisi commodo sunt mollit. Anim culpa est magna incididunt. In officia sit aute pariatur officia nisi esse ullamco minim in eu Lorem excepteur. Amet dolore voluptate excepteur adipisicing adipisicing esse minim eu non ex fugiat Lorem excepteur in. Ullamco cupidatat eu Lorem consequat Lorem in commodo eu ea tempor elit quis voluptate ullamco consectetur.",
//       "labels": [
//         {
//           "labelID": "0",
//           "labelName": "eiusmod",
//           "labelDescription": "Nostrud laborum sit deserunt duis anim ut do aliqua commodo nostrud velit elit culpa quis. Laborum est cupidatat irure aute non minim voluptate voluptate nisi sit qui commodo ullamco consequat labore. Anim quis occaecat sit ullamco voluptate labore. Veniam officia incididunt ea minim magna est minim pariatur. Nulla nisi incididunt duis esse anim proident pariatur laborum nulla reprehenderit. Aute laborum consectetur et Lorem enim elit. Deserunt proident commodo tempor. Enim elit laborum qui sint tempor fugiat incididunt reprehenderit proident.",
//           "nArtifact": 9,
//           "deleted": false
//         },
//         {
//           "labelID": "1",
//           "labelName": "sint",
//           "labelDescription": "Dolore commodo aute id culpa. Do esse irure nulla minim aliquip et fugiat veniam ut veniam cupidatat nostrud adipisicing id. Ut anim laborum ad fugiat eiusmod sit incididunt eiusmod est incididunt ea. Id exercitation sint do id anim occaecat. Fugiat nulla Lorem consequat ad duis aliqua et in. Do consectetur aliqua minim aute enim reprehenderit adipisicing culpa eiusmod proident. Excepteur Lorem Lorem et laboris ut sit anim ea cillum laboris sit culpa laborum sit excepteur.",
//           "nArtifact": 2,
//           "deleted": false
//         }
//       ]
//     }
//   ]