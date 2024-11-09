/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: zhupengfei
 * @Date: 2021-09-08 15:07:05
 * @LastEditTime: 2021-09-16 15:43:20
 * @LastEditors: zhupengfei
 * @Description:
 * @FilePath: /cocos-build/src/main.ts
 */
import * as core from '@actions/core'
import axios from 'axios'
import {exec} from '@actions/exec'
import {downloadTool, extractZip} from '@actions/tool-cache'
import * as artifact from '@actions/artifact'
import * as glob from '@actions/glob'
import fs from 'fs'

// import {wait} from './wait'

type CCDownloadType = {version: string; darwin: string; win32: string}

async function run(): Promise<void> {
  try {
    const downloadUrls = core.getInput('cocos_download_url')
    const cocosVersion = core.getInput('cocos_version')
    const configPath = core.getInput('config_path')
    let projectPath = core.getInput('project_path')
    if (!projectPath.endsWith('/')) {
      projectPath = `${projectPath}/`
    }
    const uploadArtifact = Boolean(core.getInput('upload_artifact'))
    try {
      const {data} = await (await axios.get(downloadUrls)).data
      const urlList = data['2d'] as CCDownloadType[]
      const {version, darwin} =
        cocosVersion === '0.0.0'
          ? urlList[0]
          : urlList.find(value => {
              return value.version === cocosVersion
            })!
      const ccZipPath = await downloadTool(
        darwin,
        `CocosCreator_V${version}.zip`
      )
      await extractZip(`${ccZipPath}`, './')
      await exec(`open ./CocosCreator.app`)
      let cmdOptions = 'project'
      if (parseInt(cocosVersion[0]) < 3) {
        cmdOptions = 'path'
      }
      const command = `./CocosCreator.app/Contents/MacOS/CocosCreator --${cmdOptions} ${projectPath} --build "configPath=${configPath};"`
      try {
        await exec(command)
      } catch (error: any) {
        if (error.toString().includes('36')) {
          console.log('build success')
        } else {
          core.error(error as string)
        }
      }
      if (uploadArtifact) {
        const buildConfig = JSON.parse(fs.readFileSync(configPath).toString())
        const buildPath = buildConfig.buildPath.replace(
          'project://',
          projectPath
        )
        const platform = buildConfig.platform
        const artifactClient = artifact.create()
        const artifactName = 'cocos-build-package'
        const patterns = `${buildPath}/${platform}`
        const globber = await glob.create(patterns)
        const files = await globber.glob()
        console.log('files :>> ', files)

        const rootDirectory = `${buildPath}`

        const uploadResult = await artifactClient.uploadArtifact(
          artifactName,
          files,
          rootDirectory
        )
        console.log('uploadResult :>> ', uploadResult)
      }
    } catch (error) {
      core.error(error as string)
    }
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
