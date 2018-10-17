/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-17 23:37:30 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-10-18 00:04:28
 */

import rewire from "rewire";
import { animals, AnimalRecordingsDictionary } from "../src/exampleCode";

describe("Animals Noisiness Measurement Module Test", () => {
	const animalsRecordingsDictionary: AnimalRecordingsDictionary = {
		"cat": "meowmeowmeeeeooooowmeowmeeoooooowwwwwmeow",
		"cow": "moooooohhhhhh",
		"sheep": "meeeeeeeehhhhhh",
		"elfitz": "...taptaptaptaptaptaptaptaptaptaptaptaptap...wat?!",
	};
	
	describe("Test Private Function", async () => {
		const exampleModule = rewire("../lib/exampleCode");
		const figureOutAnimalNoisiness = exampleModule.__get__("figureOutAnimalNoisiness");
		
		const results = Promise.all(Object.entries(animalsRecordingsDictionary).map(([animal, string]) => figureOutAnimalNoisiness(animal, string)));
		const expectedResults = [6, 1, 1, 16];
		
		it("should return a 4 items array", () => {
			return expect(results).resolves.toHaveLength(4);
		});
		
		it("should return the expected results", () => {
			return expect(results).resolves.toStrictEqual(expectedResults);
		});
	});

	describe("Exported function with mocked private function test", () => {
		const exampleModule = rewire("../lib/exampleCode");
		const mock = (animalName: string, recording: string) => {
			switch (animalName) {
			}
		};
		exampleModule.__set__("figureOutAnimalNoisiness", mock);
	
		const fetchFarmAnimalsWithSoundsRecording = (farmName: string) => {
			return Promise.resolve(animalsRecordingsDictionary);
		};
		const result = exampleModule.getNoisiestAnimalOnTheFarm("myFarmFromOuterSpace", fetchFarmAnimalsWithSoundsRecording);
	
		it("should return", () => {
			return expect(result).resolves.toBeDefined();
		});
	
		it("should return the expected result", () => {
			return expect(result).resolves.toStrictEqual(animals.elfitz);
		});
	});
});