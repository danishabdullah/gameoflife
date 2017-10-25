# A Quick implementation of Conway's Game of Life
#### Run without building
There's a docker image that's set up to already run this project without having to build it. You can take advantage of it as follows:
```bash
    docker run --rm -p 8000:8000 danishabdullah/gameoflife
```
Open the browser at http://localhost:8000/ and enjoy.   

#### Run everything from Maven
```bash
    mvn generate-resources spring-boot:run
```
The Maven goal `generate-resources` will execute the frontend-maven-plugin to install Node
and Npm the first time, run npm install to download all the libraries  that are not 
present already and tell webpack to generate our `bundle.js`. It's the equivalent of running `npm run build` or `npm start` on a terminal.

#### Run Maven and Webpack separately (no hot-reloading)
```bash
    mvn spring-boot:run
```
In a second terminal:
```bash
    cd src/main/frontend
    npm run build
```
#### To build and package the software
```bash
    mvn package spring-boot:repackage -e
```
#### To package into a docker image
```bash
    cd <path-to-the-repo-folder>
    mvn package spring-boot:repackage -e
    docker build -t danishabdullah/gameoflife .
```
You can then run the image as follows:
```bash
    docker run --rm -p 8000:8000 danishabdullah/gameoflife
```
Open the browser at http://localhost:8000/ and enjoy.    

## Tech stack and libraries
### Backend
- [Spring Boot](http://projects.spring.io/spring-boot/)
- [Spring MVC](http://docs.spring.io/autorepo/docs/spring/3.2.x/spring-framework-reference/html/mvc.html)
- [Spring Data](http://projects.spring.io/spring-data/)
- [Spring Security](http://projects.spring.io/spring-security/)
- [Spring Test](http://docs.spring.io/autorepo/docs/spring-framework/3.2.x/spring-framework-reference/html/testing.html)
- [Maven](https://maven.apache.org/)

### Frontend
- [Node](https://nodejs.org/en/)
- [ES6](http://www.ecma-international.org/ecma-262/6.0/)
- [ESLint](http://eslint.org/)
- [Angular](https://angular.io/)
- [Typescript](https://www.typescriptlang.org/)
- [D3](https://d3js.org/)

---
