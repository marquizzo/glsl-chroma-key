/*
 * ColorBox.ts
 * ===========
 * Placeholder shape to demonstrate setup works. 
 * Has capacity to import custom .glsl shader files
 */

import * as THREE from "three";
import { randInt } from "Utils";

import vertShader from "./glsl/key.vs";
import fragShader from "./glsl/key.fs";

interface CustomAttribs {
	offset: Float32Array,
	color: Float32Array
}

export default class ColorBox {
	mesh: THREE.Mesh;
	timeU: THREE.IUniform;

	constructor(parentScene: THREE.Scene) {
		const boxGeom = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
		const grid = new THREE.InstancedBufferGeometry();

		grid.index = boxGeom.index;
		grid.attributes.position = boxGeom.getAttribute("position");
		grid.attributes.normal = boxGeom.getAttribute("normal");
		grid.attributes.uv = boxGeom.getAttribute("uv");
		const custom = this.makeOffsetGrid(8);
		grid.addAttribute("offset", new THREE.InstancedBufferAttribute(custom.offset, 3));
		grid.addAttribute("color", new THREE.InstancedBufferAttribute(custom.color, 3));

		const mat = new THREE.RawShaderMaterial({
			uniforms: {
				time: {value: 0}
			},
			vertexShader: vertShader,
			fragmentShader: fragShader,
		});
		this.timeU = mat.uniforms.time;
		this.mesh = new THREE.Mesh(grid, mat);
		parentScene.add(this.mesh);
	}

	private makeOffsetGrid(length: number): CustomAttribs {
		const stops = length + 1;
		const count = Math.pow(stops, 3);
		const arrayOffsets = new Float32Array(count * 3);
		const arrayColors = new Float32Array(count * 3);
		const halfLength = length / 2;

		let i3 = 0;
		const pos = new THREE.Vector3();
		const color = new THREE.Vector3();
		for (let x = 0; x < stops; x++) {
			pos.x = x - halfLength;
			color.x = x / stops;
		for (let y = 0; y < stops; y++) {
			pos.y = y - halfLength;
			color.y = y / stops;
		for (let z = 0; z < stops; z++) {
			pos.z = z - halfLength;
			color.z = z / stops;

			arrayOffsets[i3 + 0] = pos.x;
			arrayOffsets[i3 + 1] = pos.y;
			arrayOffsets[i3 + 2] = pos.z;

			arrayColors[i3 + 0] = color.x;
			arrayColors[i3 + 1] = color.y;
			arrayColors[i3 + 2] = color.z;
			i3 += 3;
		}
		}
		}

		return {offset: arrayOffsets, color: arrayColors};
	}

	public update(secs: number): void {
		this.timeU.value = secs;
		this.mesh.rotation.set(
			Math.sin(secs / 10) * 2 * Math.PI,
			Math.cos(secs / 10) * 2 * Math.PI,
			0
		);
	}
}