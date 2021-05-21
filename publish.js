/**
 * This script is used to publish this package on the npm registry.
 *
 * A custom script is used to only distribute source, README and
 * license files, while maintaining the desired import paths.
 *
 * This is not possible otherwise.
 */

const IS_WINDOWS = process.platform === 'win32'

const fs = require('fs-extra')
const path = require('path')
const ora = require('ora')
const spawnAsync = require('@expo/spawn-async')
const chalk = require('chalk')
const prompt = require('prompt-sync')()

function divider(text) {
  console.log(chalk.gray(`----`), chalk.blue.bold(text.toUpperCase()), chalk.gray(`----`))
}

const spinner = ora('Initialising').start()

function getLocalPath(pathFromRoot) {
  return path.join(__dirname, pathFromRoot)
}

const tempFolder = getLocalPath('publish-tmp')
const buildFolder = getLocalPath('lib')

async function cleanUp() {
  if (fs.existsSync(tempFolder)) {
    const rm = fs.rm(tempFolder, { recursive: true, force: true })
    ora.promise(rm, 'Removing temp directory')
    await rm
  }

  if (fs.existsSync(buildFolder)) {
    const rm = fs.rm(buildFolder, { recursive: true, force: true })
    ora.promise(rm, 'Removing build directory')
    await rm
  }
}

async function main() {
  spinner.succeed()

  divider('Clean up previous')
  await cleanUp()

  divider('Preparation')

  const mkTempDir = fs.mkdir(tempFolder)
  ora.promise(mkTempDir, 'Creating temporary directory')
  await mkTempDir

  divider('Build')

  const build = spawnAsync(IS_WINDOWS ? 'yarn.cmd' : 'yarn', ['build'])
  ora.promise(build, 'Transpiling Typescript')
  await build

  const copyBuild = fs.copy(buildFolder, tempFolder, { recursive: true, overwrite: true })
  ora.promise(copyBuild, 'Copying transpiled code to temp folder')
  await copyBuild

  divider('Meta tasks')

  const copyReadme = fs.copyFile(getLocalPath('README.md'), path.join(tempFolder, 'README.md'))
  const copyLicense = fs.copyFile(getLocalPath('LICENSE.md'), path.join(tempFolder, 'LICENSE.md'))
  const copyPackageJson = fs.copyFile(getLocalPath('package.json'), path.join(tempFolder, 'package.json'))
  const copyAll = Promise.all([copyReadme, copyLicense, copyPackageJson])
  ora.promise(copyAll, 'Copying README, LICENSE and package.json')
  await copyAll

  let newVer = null

  async function modPackageJson() {
    const packageJson = await fs.readJSON(path.join(tempFolder, 'package.json'))

    const currentVer = packageJson.version
    console.log(`\nCurrent version: ${currentVer}`)
    newVer = prompt(`New version: `, currentVer)

    if (newVer === null) {
      throw 'Invalid version'
    }

    packageJson.version = newVer

    // Write back new version name
    await fs.writeJSON(getLocalPath('package.json'), packageJson, { spaces: 2 })

    // Remove unneeded sections
    delete packageJson.private
    delete packageJson.scripts

    // Overwrite module info
    packageJson.types = './index.d.ts'
    packageJson.main = './index.js'

    // Write final modified JSON to temp folder
    await fs.writeJSON(path.join(tempFolder, 'package.json'), packageJson, { spaces: 2 })
  }

  try {
    const mod = modPackageJson()
    ora.promise(mod, 'Modifying package.json')
    await mod
  } catch {
    process.exit(-1)
  }

  divider('Publish package')

  const OTP = prompt('Enter OTP (leave blank if none): ')

  process.chdir(tempFolder)

  const publish = spawnAsync(IS_WINDOWS ? 'yarn.cmd' : 'yarn', ['publish', OTP ? `--otp` : '', OTP ? OTP : '', '--tag', newVer])
  ora.promise(publish, 'Publishing package')
  await publish

  divider('Clean up')
  await cleanUp()
}

main()
