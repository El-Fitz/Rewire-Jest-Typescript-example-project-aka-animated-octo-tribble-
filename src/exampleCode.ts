/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-17 23:37:35 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-10-18 00:04:50
 */

const catSoundRegex = /((me+o+w+))/gi;
const cowSoundRegex = /((mo{2,}))/gi;
const sheepSoundRegex = /((me{2,}h+))/gi;
const elfitzSoundRegex = /((\.{3})|(tap)|(wat\?!))/gi;

export enum animals {
	cat = "cat",
	cow = "cow",
	sheep = "sheep",
	elfitz = "elfitz",
}

export interface AnimalRecordingsDictionary {
	[key: string]: string;
}

interface AnimalWithNoisiness {
	name: animals;
	noisiness: number;
}

export async function getNoisiestAnimalOnTheFarm(farmName: string, fetchFarmAnimalsWithSoundsRecording: (farmName: string) => Promise<AnimalRecordingsDictionary>): Promise<animals> {
	try {
		// 1. List all the farm's animals and get their sound recording
		const farmAnimalsWithSounds = await fetchFarmAnimalsWithSoundsRecording(farmName);

		// 2. Figure out each animal's noisiness, but for the purpose of this post I was lazy. Sorry.
		const farmAnimalsWithNoisiness: AnimalWithNoisiness[] = Object.entries(farmAnimalsWithSounds).reduce((acc: AnimalWithNoisiness[], [name, sound]: string[]) => {
			return acc.concat([ { name: name as animals, noisiness: figureOutAnimalNoisiness(name, sound)} ])
		}, []);

		// 3. Figure out the noisiest animal of them all and return it
		return farmAnimalsWithNoisiness.reduce((max, current) => max.noisiness > current.noisiness ? max : current).name;
	} catch (error) {
		// tslint:disable-next-line:no-console
		console.log("Error: ", error);
		throw(error);
	}
}

function figureOutAnimalNoisiness(animalName: string, soundString: string): number {
	let regex;
	switch (animalName) {
		case animals.cat:
			regex = catSoundRegex;
			break
		case animals.cow:
			regex = cowSoundRegex;
			break
		case animals.sheep:
			regex = sheepSoundRegex;
			break
		case animals.elfitz:
			regex = elfitzSoundRegex;
			break
		default:
			throw new Error("This isn't an animal !");
	}
	const regexResult = soundString.match(regex);
	if (regexResult !== null) return regexResult.length;
	throw new Error("The regex match failed. This isn't supposed to happen !");
}