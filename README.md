# Antd Admin Springboot

[![React](https://img.shields.io/badge/react-^15.6.1-brightgreen.svg?style=flat-square)](https://github.com/facebook/react)
[![Ant Design](https://img.shields.io/badge/ant--design-^2.11.2-yellowgreen.svg?style=flat-square)](https://github.com/ant-design/ant-design)
[![dva](https://img.shields.io/badge/dva-^2.0.1-orange.svg?style=flat-square)](https://github.com/dvajs/dva)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/javahuang/antd-admin-springboot/pulls)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

演示地址 <http://114.215.47.214:8080/>

admin/hello，请不要修改管理员账号的密码。

## 特性

- 前端基于最新版本的 [antd-admin](https://github.com/zuiidea/antd-admin)
- 后端基于 springboot，同时整合了 shiro、mybatis，数据库使用的 mysql
    * 后端添加了自动分页插件
    * 基于 shiro 的 RBAC 权限控制，能动态配置菜单、角色、权限等
    * 统一异常处理
    * ...
- 开发、部署简单，能实现前后端同时开发且无需额外修改配置


### 目录结构
前端目录结构参见 [目录结构](https://github.com/zuiidea/antd-admin#目录结构)


### 快速开始

克隆项目文件:

```bash
git clone https://github.com/javahuang/antd-admin-springboot
```

进入目录安装依赖:

```bash
# 前端
# 开始前请确保没有安装roadhog、webpack到NPM全局目录
npm i 或者 yarn install

# 后台
# 根据 pom.xml 配置下载 maven 依赖包
```

开发：

```bash
# 前端
npm run build:dll #第一次npm run dev时需运行此命令，使开发时编译更快
npm run dev
打开 http://localhost:8000

# 后台
# 直接运行 me.hrps.aas.Application-main() 方法启动后台服务
```

构建：

```bash
# 前端
npm run build
将会打包至dist/{version}目录 #package.json里version字段
将 dist 目录下面所有文件拷贝到 src/main/resources/static 目录下面

# 后台
mvn clean install
```

部署:

```bash
# 上一步会在生成 war/ROOT.war 
# 方式1，直接运行 war 包
nohup java -jar ROOT.war &
# 方式2，丢到 tomcat 的 webapps 目录下面
```


