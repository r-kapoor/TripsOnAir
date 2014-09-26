

By default, vert.x runs Javascript with Rhino. Change this by creating a `langs.properties` file at the root of your project that looks something like this.

	nashorn=io.vertx~lang-nashorn~0.1-SNAPSHOT:org.vertx.java.platform.impl.NashornVerticleFactory.js=nashorn