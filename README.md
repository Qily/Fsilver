#Fsilver
<h3>Fsilver介绍</h3>
<p>
    本项目是基于wechat小程序和node.js用于环境监测的应用程序，由于是私人项目，杜绝代码共享。
</p>

<h3>Fsilver环境要求</h3>
<p>
    npm 8.2+<br>
    git<br>
    微信web开发工具<br>
</p>

<h3>部署Fsilver</h3>
<p>
$  git clone https://git.coding.net/Qily/Fsilver.git<br>
$  cd Fsilver/server<br>
$  npm install
</p>

<h3>Git基本命令</h3>
<p>
<h5>查看</h5>
$ git status<br>
$ git log<br>
<h5>提交</h5>
$ git add -A<br>
$ git commit -m "commit msg"<br>
$ git pull origin master<br>
$ git push origin master<br>
<h5>版本回退</h5>
$ git log<br>
$ git reset --hard 458943998<br>

<h5>分支</h5>
$ git branch QilyDev<br>
$ git checkout QilyDev<br>
以上两句等同于$ git checkout -b QilyDev<br>
<br>
$ git merge QilyDev(当前在master分支)<br>
P.S. 分支创建第一次提交可能出现错误 The current branch QilyDev has no upstream branch<br>
只要提交改为git push --set-upstream origin QilyDev就可以了<br>
</p>

<h5>我的一般实践</h5>
1. 在coding或者github上创建一个工程项目
2. 通过打开cmd(Ubuntu上打开终端)
3. git clone https://xxx.xxx.xxx.git
4. 在本地中找到项目根目录，将之前的工程文件copy到这个根目录中
5. 创建一个.gitignore并将需要忽略的文件写在该文件中，比如这个项目中就不需要将node_module相关库放在代码仓库中，就可以把整个文件夹忽略
6. git add -A-----------------git commit -m "First version"------------------git push origin master
7. 多人开发创建分支：git checkout -b Qily----------当前处于Qily分支，修改一个文件----------git add -A------------git commit -m "commit msg"----------git push --set-upstream origin Qily（第一次提交）
8. git checkout master-------当前在master分支，可能要求pull一下----------git pull-----------------git merge Qily(合并分支)-------git push origin master（将代码提交到远程master中）--------git checkout Qily
9. 其他项目组成员加入：项目负责人先将其在coding或者github私人项目上将其添加到项目中----------项目组成员在自己的电脑上做3， 7，8步操作
10. 正常开发时：git pull origin master------------开始工作先从远程master获取代码-----------修改（无bug,程序能正常运行），提交--------git add -A-------------------git commit -m "修改了一个测试功能"------------git push------（此时是提交到了自己所在的分支）-----------合并分支-------（这里可能就不是一般成员要操作的了，可能是向项目负责人申请提交请求）git checkout master--------git merge LiQi-----git checkout QilyDev
<h5>git说明</h5>
1.理解git最重要的是理解本地仓库和远程仓库<br>
2.上面我的一般实践中第10步QilyDev是项目负责人分支，LiQi是普通成员分支<br>
3.一般的开发是在分支上进行，只有在程序没有bug,能完成运行的状态下能提交到master中，其他的情况现在分支中完善<br>
4.开发节奏一般是开始工作前从master pull,完成工作向自己分支push,并提交合并分支请求<br>
<h5>特别说明</h5>
本篇纯属个人理解
<br>
<h6>All Right Reserved By Qily</h6>
