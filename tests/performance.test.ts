// import {describe} from "mocha";
//
// function doArray(size: number, array: any[], deleteSize: number) {
//     for (let i = 0; i < size; i++) {
//         array.push(i);
//     }
//     for (let i = 0; i < deleteSize; i++) {
//         array[i] = undefined;
//     }
//     for (let i = 0; i < deleteSize; i++) {
//         array[i] = i;
//     }
//     for (let i = 0; i < size; i++) {
//         if(array[i] == 1000) {
//             console.log(array[i])
//         }
//     }
// }
//
// function doObject(size: number, object: {}, deleteSize: number) {
//     for (let i = 0; i < size; i++) {
//         object[i] = i;
//     }
//     for (let i = 0; i < deleteSize; i++) {
//         delete object[i];
//     }
//     for (let i = 0; i < deleteSize; i++) {
//         object[i] = i;
//     }
//     for (let i = 0; i < size; i++) {
//         if(object[i] == 1000) {
//             console.log(object[i])
//         }
//     }
//
// }
//
// describe('performance array vs object', () => {
//     const size = 10000;
//     const deleteSize = 5000;
//     const array = [];
//     const object = {};
//     let start = 0;
//     let name = '';
//
//     beforeEach( () => {
//         start = new Date().getTime();
//     });
//
//     afterEach(() => {
//         console.log(name, (new Date().getTime() - start))
//     })
//
//
//     it('fill array', () => {
//         // @ts-ignore
//         name = 'array';
//         const vacant = [];
//         doArray(size, array, deleteSize);
//         doArray(size, array, deleteSize);
//         doArray(size, array, deleteSize);
//         doArray(size, array, deleteSize);
//         doArray(size, array, deleteSize);
//     });
//     it('fill obj', () => {
//         // @ts-ignore
//         name = 'obj';
//         doObject(size, object, deleteSize);
//         doObject(size, object, deleteSize);
//         doObject(size, object, deleteSize);
//         doObject(size, object, deleteSize);
//         doObject(size, object, deleteSize);
//
//     })
// })