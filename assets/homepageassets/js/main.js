(function(){

    var viewer, container, top, projects, threeSixtyImages, github, linkedin, contact, routePanoramas, assetPath, items, selection, progressElement, progress;

    assetPath = 'examples/asset/textures/equirectangular';
    selection = document.querySelector( '.item.selected' );

    routePanoramas = {
      Home: {
        panorama: new PANOLENS.ImagePanorama( './360/images/newyork/wharf.jpg' ),
        initialLookPosition: new THREE.Vector3( 2.5, 1.5, 3 )
      },
    };

    container = document.querySelector( 'section.background' );
    top = document.querySelector( 'section.top' );
    projects = document.querySelector( 'section.projects');
    threeSixtyImages = document.querySelector( 'section.threeSixtyImages' );
    github = document.querySelector( 'section.github' );
    linkedin = document.querySelector( 'section.linkedin' );
    contact = document.querySelector( 'section.contact' );
    items = document.querySelectorAll( '.item' );
    progressElement = document.getElementById( 'progress' );

    viewer = new PANOLENS.Viewer( { container: container, controlBar: false } );

    window.addEventListener( 'orientationchange', function () {
      setTimeout(function(){
        viewer.onWindowResize(window.innerWidth, window.innerHeight)
      }, 200);

    }, false );

    function onEnter ( event ) {
      progressElement.style.width = 0;
      progressElement.classList.remove( 'finish' );
    }

    function onProgress ( event ) {
      progress = event.progress.loaded / event.progress.total * 100;
      progressElement.style.width = progress + '%';
      if ( progress === 100 ) {
        progressElement.classList.add( 'finish' );
      }
    }

    function addDomEvents () {

      container.addEventListener( 'mousedown', function(){
        this.classList.add( 'mousedown' );
      }, false );

      container.addEventListener( 'mouseup', function(){
        this.classList.remove( 'mousedown' );
      }, false );

      for ( var i = 0, hash; i < items.length; i++ ) {
        hash = items[ i ].getAttribute( 'data-hash' );
        if ( hash ) {
          items[ i ].addEventListener( 'click', function () {
            routeTo( this.getAttribute( 'name' ), this );
          }, false );
        }

        if ( hash === window.location.hash ) {
          routeTo( hash.replace( '#', '' ), items[ i ] );
        }
      }
    }

    function setUpInitialState () {
      if ( routePanoramas ) {
        for ( var routeName in routePanoramas ) {
          if ( routePanoramas.hasOwnProperty( routeName ) ) {
            var route = routePanoramas[ routeName ];
            route.panorama.addEventListener( 'progress', onProgress );
            route.panorama.addEventListener( 'enter', onEnter );
            if ( route.initialLookPosition ) {
              route.panorama.addEventListener('enter-fade-start', function( position ){
                viewer.tweenControlCenter( position, 0 );
              }.bind( this, route.initialLookPosition ));
            }
            viewer.add( route.panorama );
          }
        }
      }
    }

    addDomEvents();
    setUpInitialState();

})();
