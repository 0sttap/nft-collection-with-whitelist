const path = require("path");
const fs = require("fs");
const util = require('node:util'); 
const { exec } = require('node:child_process');

const { TASK_COMPILE_GET_COMPILATION_TASKS } = require("hardhat/builtin-tasks/task-names");

subtask("compile:huff", "build the huff files")
  .setAction(async function (args, hre, runSuper) {
     await compile(hre);
});

subtask(TASK_COMPILE_GET_COMPILATION_TASKS, "hooked to build huff files")
  .setAction(async function (args, hre, runSuper) {
    let tasks = await runSuper();
    tasks = tasks.concat(["compile:huff"]);
    return tasks;
});

async function compile(hre) {
    
    let artifactsList = []

    await verifyHuffCompiler();

    const files = await getHuffSources(hre.config.paths);

    if(files.length == 0) {
        console.log("huffc: Nothing to compile");
        return;
    }

    for (const file of files) {
        const cwdPath = path.relative(process.cwd(), file);
        console.log(`huffc: Compiling ${cwdPath}...`);

        const contractName = path.parse(file).name;

        let abi = [];
        if(config.huff_artifacts.hasOwnProperty(contractName)) {
            abi = hre.config.huff_artifacts[contractName].abi;
        }

        const bytecode = "0x" + await buildHuffBytecode(cwdPath);
        const deployed_bytecode = "0x" + await buildHuffRuntime(cwdPath);
    
        const file_name = path.basename(file);

        const artifact = {
            _format: "hh-yul-artifact-1",
            contractName: path.parse(file).name,
            sourceName: file_name,
            abi: abi,
            bytecode: bytecode,
            deployedBytecode: deployed_bytecode,
            linkReferences: {},
            deployedLinkReferences: {},
        };

        
        await hre.artifacts.saveArtifactAndDebugFile(artifact);
        artifactsList.push({ ...artifact, artifacts: [artifact.contractName] });

        hre.artifacts.addValidArtifacts(artifactsList);
    }
}

async function verifyHuffCompiler() {
    return new Promise((resolve, reject) => {
        exec(`huffc -V`, (err, stdout) => {
            if (err !== null || stdout.includes("0.0.")) {
                reject(new Error(`huffc: Huff compiler not found. Please install it https://docs.huff.sh/get-started/installing/`));
            }
            resolve(stdout);
        });
        process.stdin.end();
    });
}

async function buildHuffBytecode(path) {
    return new Promise((resolve, reject) => {
        exec(`huffc ${path} -b`, (err, stdout) => {
            if (err !== null) {
                reject(new Error(err));
            }
            resolve(stdout);
        });
        process.stdin.end();
    });
}

async function buildHuffRuntime(path) {
    return new Promise((resolve, reject) => {
        exec(`huffc ${path} -r`, (err, stdout) => {
            if (err !== null) {
                reject(new Error(err));
            }
            resolve(stdout);
        });
        process.stdin.end();
    });
}

async function getHuffSources(paths) {
    const glob = require("glob");
    const huffFiles = glob.sync(path.join(paths.sources, "**", "*.huff"));

    return huffFiles;
}

module.exports = { compile }