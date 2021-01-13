(function() {
    'use strict';

    angular
        .module('app')
        .directive('canv', canv);

    canv.$inject = ['$timeout','$window'];
    
    function canv ($timeout, $window) {
        // Usage:
        //     <canv></canv>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A',
            scope:true
        };
        return directive;

        function link(scope, element, attrs) {
            scope.snapshot = snapshot;
            var snapshotInt = 1;

            var vid = element.find('video')[0];
            var canv = element.find('canvas')[0];

            scope.width = 640;
            scope.height = 480;


            var context = canv.getContext('2d');
            var vendorUrl = $window.URL;
            var videoRatio = scope.height / scope.width;
         

            console.log(vid);
            navigator.getMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia ||
                                 navigator.msGetUserMedia;


            navigator.getMedia({
                video: true,
                audio: false,
            }, function (stream) {
                vid.src = vendorUrl.createObjectURL(stream);
            }, function (error) {
                console.log(error);
            })

            vid.addEventListener('click', function () {
                videoRatio = vid.videoHeight / vid.videoWidth;
                scope.width = vid.videoWidth/3;
                scope.height = vid.videoHeight/3;
                canv.width= scope.width;
                canv.height= scope.height;


                context.fillRect(0,0,scope.width,scope.height)
                draw(vid, 0,0, scope.width, scope.height);
//                context.drawImage(this, 0, 0, 450, 250);
            }, false)


            function draw(vid, x,y,w,h) {
                context.drawImage(vid, x, y, scope.width, scope.height);
            }
            var canvasEl = '<canvas width="0" height="0" style="background-color:grey"></canvas>';

            function snapshot() {
                var w=scope.width/3;
                var h=scope.height/3;
                var okienka = element.find('okienka');

                okienka.append(angular.element(canvasEl));
                var c = element.find('canvas')[snapshotInt]

                c.id = "new" + snapshotInt;
                c.width = w;
                c.height = h;

                var cCntxt = c.getContext('2d');
                cCntxt.drawImage(vid, 0, 0, w,h);
                console.log(element);

                snapshotInt += 1;

            }
            


        }
    }

})();