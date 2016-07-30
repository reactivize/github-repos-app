
#Client-side Setup


```bash

#change into the root folder of the project


# install packages...
npm i


# production build...
# - run this command first to create the bundle.js
# - give it one minute
# - will create a /public/ folder with a bundle.js and copied in index.html
# - and you will get your terminal prompt back
npm run build


# open up an other docker terminal
# - run webpack-dev-server from this new terminal
# - give it 30 seconds
# - when the terminal output says 'emit...', then you're ready to hit the url in the browser
npm run dev


#  open the web browser to...
#  http://localhost:8888
  
```




## Screenshots:

![githubrepos - default load]()
![githubrepos - search filter]()





## Extras:

```bash
# if you wish to run client app code in a docker container...
# - open docker terminal
# - cd into root folder of project
# - then run...
docker run -it -v "$PWD":/githubReposApp -p 8888:8888 node:6.2.1 /bin/bash

# now that you're in the shell of the container, cd into the root of the project
cd githubReposApp

npm i

npm run build

npm run dev


#  open the web browser to...
#  192.168.99.100:8888

# docker note:
# - (get your docker container ip using.... `docker-machine ip`)
```