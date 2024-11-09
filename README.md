<!--
 * @Author: zhupengfei
 * @Date: 2021-09-08 15:07:05
 * @LastEditTime: 2021-09-16 15:43:42
 * @LastEditors: zhupengfei
 * @Description:
 * @FilePath: /cocos-build/README.md
-->

# Cocos Creator Build Use ConfigPath

This action is forked from [https://github.com/miggene/cocos-build](cocos-build)，the difference is:
1. only support configPath
2. upload artifact is a option now

This action provides the following functionality for Github Actions users:

- automate building for cocos creator project
- configuring cocos_download_url, cocos-version, project_path, config_path, upload_artifact for building
- only run on mac

| inputs             | required | description                 | default                                                                |
| ------------------ | -------- | --------------------------- | ---------------------------------------------------------------------- |
| cocos_download_url | false    | cocos creator download urls | https://creator-api.cocos.com/api/cocoshub/editor_version_list?lang=zh |
| cocos_version      | false    | cocos creator version       | 3.8.4                                                                  |
| config_path         | true    | cocos creator build config path   | ./web-desktop.json                                                                     |
| project_path       | false    | project path for build      | ./                                                                     |
| upload_artifact    | false    | whether upload artifact  | true                                                             |

## Usage

See [action.yml]()

**Basic**

```
steps:
    - uses: actions/checkout@v2
    - uses: lyzz0612/cocos-build@v1.0.0
    	with:
        	config_path: ./web-desktop.json
```
