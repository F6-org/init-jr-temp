'use strict'
const child_process = require('child_process');
const exec = child_process.exec;
const execSync = child_process.execSync;
const co = require('co');
const prompt = require('co-prompt');
const fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
	co(function* () {
		let projectName = yield prompt('Project name（项目名称）: ');
		let pureTempUrl;

		pureTempUrl = "http://git.sc.weibo.com/horizon/pureFrame.git";
		// git命令，远程拉取项目并自定义项目名
		let cmdStr = `git clone ${pureTempUrl} ${projectName} && cd ${projectName}`;

		console.log(chalk.white('\n Start generating...'));

		execSync(cmdStr, (error, stdout, stderr) => {
			if (error) {
				console.log(error);
				process.exit();
			}
			console.log(chalk.green('\n √ Generation completed!!!'));
		})

		let projectOnlineUrl = yield prompt('Project online url（项目线上地址定义 例：//js.t.sinajs.cn/c2p/purchase/lucky/）: ');

		function editFile(params) {
			//现将json文件读出来
			let fileUrl = `./${projectName}/routes/config.js`;
			// fs.readFile(fileUrl, function (err, data) {
			let setting =
				`module.exports = {
	routes: {
		'/home': {
			component: 'Home/Home',
			title: '首页',
		},
		'/info': {
			component: 'Info/Info',
			title: '信息',
		},
		'/': {
			component: 'Error/Error',
			title: '出错啦',
		}
	},
	baseUrl: '${projectOnlineUrl}'
};`
			fs.writeFileSync(fileUrl, setting);
		}

		yield editGit();

		function* editGit() {
			var gitUrl = yield prompt('git url（项目线上git地址）: ');
			console.log(gitUrl, "0000000000000000")

			if (gitUrl == '') {
				let cmdStr = `cd ${projectName} && git init`;
				execSync(cmdStr, (error, stdout, stderr) => {
					if (error) {
						console.log(error);
						process.exit();
					}
					console.log(chalk.red('\n √ ------------ 要记得手动配置项目git地址哦 -------------'));
					console.log(`\n cd ${projectName} && npm install \n`)
					process.exit();
				})
			}

			let cmdStr = `cd ${projectName} && git init && git remote rm origin && git remote add origin ${gitUrl} && env GIT_SSL_NO_VERIFY=true git push origin master`;

			console.log(chalk.white(`\n Start git push ${gitUrl}.........................`));

			exec(cmdStr, (error, stdout, stderr) => {
				if (error) {
					console.log(error);
					process.exit();
				}
				console.log(chalk.green('\n √ git push completed!!!'));
				console.log(`\n cd ${projectName} && npm install \n`)
				process.exit();
			})
		}
		
		editFile();
	})


}