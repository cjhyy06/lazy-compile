this prokect used for testing vue loader hmr which is not working for webpack lazy complilation

# install and start

1. npm install --unsafe-perm
2. npm start

# reproduce steps

1. update and save template div content in src/pages/home/index.vue
2. watch the dev console log(hmr info)
3. even the hmr update to date,the vue template not rerendered

BTW if use another way for js reference,the template can be successfully updated!
1. also update and save template div content in src/pages/p2/index.vue
2. watch the dev console log(hmr info)
3. after hmr updated,the template content updated correct.
