import { itemParams, boxTypes } from './config.js';

export const mergeLayers = (sortedLayers) => {
  const layers = [];
  const images = [];
  try {
    for (let i = 0; i < sortedLayers.length; i++) {
      const l = sortedLayers[i];
      for (let j = 0; j < itemParams.length; j++) {
        if (
          l.boxType === itemParams[j].boxType &&
          l.itemId === itemParams[j].itemId
        ) {
          layers.push(itemParams[j]);
          break;
        }
      }
    }
    for (let i = 0; i < layers.length; i++) {
      images.push(`./avatar/${layers[i].boxName}/${layers[i].itemName}.png`);
    }
  } catch (err) {
    // console.log('error: ' + sortedLayers);
  }
  return { layers, images };
};

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
  const sortedArray = [0, 0, 0, 0, 0, 0];
  const orignalArray = [];
  for (let i = itemIds.length - 2; i >= 0; i = i - 2)
    orignalArray.push({
      boxType: boxTypes[boxTypes.length - 1 - i / 2],
      itemId: parseInt(itemIds.substr(i, 2), 16),
    });
  sortedArray[0] = orignalArray[0];
  sortedArray[1] = orignalArray[4];
  sortedArray[2] = orignalArray[1];
  sortedArray[3] = orignalArray[5];
  sortedArray[4] = orignalArray[2];
  sortedArray[5] = orignalArray[3];
  return sortedArray;
};

export const parseMetadata = (md) => {
  let mdStr = md.toHexString();
  if (mdStr.length === 20) mdStr = '0x00' + mdStr.substr(2, 18);
  const sortedLayers = sortLayer(mdStr.substr(10, 12));
  const mergedLayers = mergeLayers(sortedLayers);
  if (mergedLayers.images.length === 0) return null;

  let level = 0;
  let experience = 0;
  let rarity = 1;
  const properties = [];
  for (let i = 0; i < mergedLayers.layers.length; i++) {
    level = level + mergedLayers.layers[i].level;
    experience = experience + mergedLayers.layers[i].experience;
    rarity = (rarity * mergedLayers.layers[i].rarity) / 1000000;
    properties.push({
      trait_type: mergedLayers.layers[i].boxName,
      value: mergedLayers.layers[i].itemName,
      level: mergedLayers.layers[i].level,
      experience: mergedLayers.layers[i].experience,
      rarity: mergedLayers.layers[i].rarity,
    });
  }

  return {
    artifacts: md.toHexString(),
    properties,
    level,
    experience,
    rarity: (rarity * 1000000).toFixed(4),
    images: mergedLayers.images,
    layers: mergedLayers.layers,
  };
};

export const getBackgroundId = (md) => {
  const mdStr = md.toHexString();
  return mdStr.substr(-2);
};

// Following function is for testing only
// const probability = () => {
// 	let itemsArray = {};
// 	let traits = [];
// 	for(let i = 0; i < boxTypes.length; i++) {
// 		itemsArray[boxTypes[i]] = [];
// 		for(let j = 0; j < itemParams.length; j++) {
// 			if(boxTypes[i] === itemParams[j].boxType) itemsArray[boxTypes[i]].push(itemParams[j]);
// 		}
// 	}

// 	for(let i = 0; i < boxTypes.length; i++) {
// 		let sum = 0;
// 		const random = Math.floor(Math.random() * 1000000);
// 		for(let j = 0; j < itemsArray[boxTypes[i]].length; j++) {
// 			sum = sum + itemsArray[boxTypes[i]][j].rarity;
// 			if(sum > random) {
// 				traits.push(itemsArray[boxTypes[i]][j]);
// 				break;
// 			}
// 		}
// 	}

// 	return traits;
// }

// const simMultiProbability = (times) => {
// 	// let itemCount = [
// 	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	// ];
// 	let rarities = [];
// 	let experiences = [];
// 	for(let i = 0; i < times; i++) {
// 		const traits = probability();
// 		let rarity = 1;
// 		let experience = 0;
// 		for(let j = 0; j < boxTypes.length; j++) {
// 			// itemCount[j][traits[j].itemId] = itemCount[j][traits[j].itemId] + 1;
// 			rarity = rarity * traits[j].rarity / 1000000;
// 			experience = experience + traits[j].experience;
// 		}
// 		rarities.push((rarity * 1000000).toFixed(2));
// 		experiences.push(experience);
// 	}
// 	// console.log(itemCount);
// 	console.log('======= Rarities ========');
// 	console.log(rarities.toString());
// 	console.log('====== Experiences ======');
// 	console.log(experiences.toString());
// }

// simMultiProbability(20000);
