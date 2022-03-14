import {itemParams, boxTypes} from './config.js';

export const mergeLayers = (sortedLayers) => {
	let layers = [];
	let images = [];
	try {
		for(let i = 0; i < sortedLayers.length; i++) {
			const l = sortedLayers[i];
			for(let j = 0; j < itemParams.length; j++) {
				if(l.boxType === itemParams[j].boxType && l.itemId === itemParams[j].itemId) {
					layers.push(itemParams[j]);
					break;
				}
			}
		}
		for(let i = 0; i < layers.length; i++) {
			images.push(`./avatar/${layers[i].boxName}/${layers[i].itemName}.png`);
		}
	} catch(err) {
		console.log('error: ' + sortedLayers);
	}
	return {layers, images};
}

/**
 * Ex. 02030a020501
 * From right to left:
 * boxType: 2, Background, 01
 * boxType: 3, Body, 05
 * boxType: 4, Eyes, 02
 * boxType: 5, Head, 0a
 * boxType: 6, Fur, 03
 * boxType: 7, Mouth, 02
 * 
 * After sorting the layers, the output will be: Background -> Fur -> Body -> Mouth -> Eyes -> Head, 
 * Boxtype: 2, 6, 3, 7, 4, 5 => itemId: 01, 03, 05, 02, 02, 0a
 * 
 */
export const sortLayer = (itemIds) => {
	let sortedArray = [0, 0, 0, 0, 0, 0];
	let orignalArray = [];
	for(let i = itemIds.length - 2; i >= 0; i = i - 2) orignalArray.push({boxType: boxTypes[boxTypes.length - 1 - i / 2], itemId: parseInt(itemIds.substr(i, 2), 16)});
	sortedArray[0] = orignalArray[0];
	sortedArray[1] = orignalArray[4];
	sortedArray[2] = orignalArray[1];
	sortedArray[3] = orignalArray[5];
	sortedArray[4] = orignalArray[2];
	sortedArray[5] = orignalArray[3];
	return sortedArray;
}
