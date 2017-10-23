# A Quick implementation of Conway's Game of Life
#### Run everything from Maven

    mvn generate-resources spring-boot:run

The Maven goal `generate-resources` will execute the frontend-maven-plugin to install Node
and Npm the first time, run npm install to download all the libraries  that are not 
present already and tell webpack to generate our `bundle.js`. It's the equivalent of running `npm run build` or `npm start` on a terminal.

#### Run Maven and Webpack separately (no hot-reloading)

    mvn spring-boot:run
In a second terminal:
    
    cd src/main/frontend
    npm run build

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
