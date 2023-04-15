# Societas
Empower creative UW individuals to find like-minded people to make their dream and goals come true.
<br>
## Installation
## Usage
## Contributing
### Always make sure main branch have only that runnable code. if you are half way done something, don’t merge it to the main.

### Never work on the main branch directly

#### ssh key setup, only the first time
```
ssh-keygen  (key generate process, keep pressing enter)
cat ~/.ssh/id_rsa.pub (copy the key and paste it into Github)
```

#### Walkthrough
```
git clone (SSH)
git branch (check which your branch is at)
git checkout -b xxx (create a new branch called xxx and switch to that branch)
git branch (make sure you are in the right branch)
```
work on your local and save work
```
git status ( check the status of your branch, it should something got modified)
git add . (add all the changes to the branch)
git commit -m "xxxx" (commit the change, leave the comments in “”)
git push ( push the changes)
git push --set-upstream origin xxxx (git push will tell you the correct push command line, copy and run that)

(push all the updates from you own branch into GitHub, once a team members approved, it will merge into the main. and don’t forget to delete your own branch to make sure the work environment is clean)

git checkout -b xxxx (next time when you work, create a new branch)
git pull origin main (make sure you have the latest version of the main branch before you work)
```
## Contact