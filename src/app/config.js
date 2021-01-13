(function () {
    'use strict';

    var app = angular.module('app')
        .config(appConfig);
    
    appConfig.$inject=['$mdIconProvider', '$mdDateLocaleProvider', '$mdThemingProvider', 'toastrConfig'];

    function appConfig ($mdIconProvider, $mdDateLocaleProvider, $mdThemingProvider, toastrConfig) {

        angular.extend(toastrConfig, {
            allowHtml: true,
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-bottom-full-width',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            tapToDismiss:false,
            target: 'body',
            timeOut:2500,
        });


        $mdIconProvider
            .icon('alert', 'fonts/ic_error_outline_black_24px.svg', 24)
            .icon('add', 'fonts/ic_add_24px.svg', 24)
            .icon('add_person', 'fonts/ic_person_add_24px.svg', 24)
            .icon('arrowUp', 'fonts/ic_arrow_drop_up_24px.svg', 24)
            .icon('arrowDown', 'fonts/ic_arrow_drop_down_24px.svg', 24)
            .icon('back', 'fonts/ic_arrow_back_24px.svg', 24)
            .icon('backUp', 'fonts/ic_backup_black_24px.svg', 24)
            .icon('backUpRestore', 'fonts/ic_settings_backup_restore_black_24px.svg', 24)
            .icon('cancel', 'fonts/ic_cancel_24px.svg', 24)
            .icon('chevLeft', 'fonts/ic_chevron_left_black_24px.svg', 24)
            .icon('chevRight', 'fonts/ic_chevron_right_black_24px.svg', 24)
            .icon('clear', 'fonts/ic_clear_black_24px.svg', 24)
            .icon('clearAll', 'fonts/ic_clear_all_black_24px.svg', 24)
            .icon('clone', 'fonts/ic_clone_24px.svg', 48)
            .icon('code', 'fonts/ic_code_24px.svg', 24)
            .icon('contentCopy', 'fonts/ic_content_copy_black_24px.svg', 24)
            .icon('create', 'fonts/ic_create_black_24px.svg', 24)
            .icon('dateRange', 'fonts/ic_date_range_black_24px.svg', 24)
            .icon('delete', 'fonts/ic_delete_24px.svg', 24)
            .icon('deleteForever', 'fonts/ic_delete_forever_black_24px.svg', 24)
            .icon('doneAll', 'fonts/ic_done_all_black_24px.svg', 24)
            .icon('download', 'fonts/ic_file_download_black_24px.svg', 24)
            .icon('edit', 'fonts/ic_edit_24px.svg', 24)
            .icon('excel', 'fonts/excelIcon24.svg', 24)
            .icon('exit', 'fonts/ic_exit_to_app_24px.svg', 24)
            .icon('exit2', 'fonts/ic_power_settings_new_24px.svg', 24)
            .icon('info', 'fonts/ic_info_outline_black_24px.svg', 24)
            .icon('list', 'fonts/ic_format_list_numbered_24px.svg', 24)
            .icon('list2', 'fonts/ic_list_black_24px.svg', 24)
            .icon('login', 'fonts/login_24px.svg', 24)
            .icon('menu', 'fonts/ic_menu_24px.svg', 24)
            .icon('more_vert', 'fonts/ic_more_vert_24px.svg', 24)
            .icon('print', 'fonts/ic_print_black_24px.svg', 24)
            .icon('qrCode', 'fonts/qrcode-512px.svg', 24)
            .icon('refresh', 'fonts/ic_refresh_24px.svg', 24)
            .icon('register', 'fonts/register_24px.svg', 24)
            .icon('remove', 'fonts/ic_remove_black_24px.svg', 24)
            .icon('remove_circle', 'fonts/ic_remove_circle_outline_24px.svg', 24)
            .icon('save', 'fonts/ic_save_24px.svg', 24)
            .icon('search', 'fonts/ic_search_24px.svg', 24)
            .icon('selectAll', 'fonts/ic_select_all_black_24px.svg', 24)
            .icon('sort', 'fonts/ic_sort_by_alpha_24px.svg', 24)
            .icon('szukaj', 'fonts/ic_szukaj_24px.svg')
            .icon('thumbDown', 'fonts/ic_thumb_down_black_24px.svg')
            .icon('thumbUp', 'fonts/ic_thumb_up_black_24px.svg')
            .icon('undo', 'fonts/ic_undo_black_24px.svg')
            .icon('upload', 'fonts/ic_file_upload_black_24px.svg', 24)
            .icon('warning', 'fonts/ic_warning_black_24px.svg', 24);

        $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default': '400',
            'hue-1': '900', 
            'hue-2': '700', 
            'hue-3': '500',
        })
        .accentPalette('blue-grey', {
            'default': '400', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '900', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '700',
            'hue-3': '500' 
        })

        .warnPalette('orange', {
            'default': '400', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '900',
            'hue-2': '700',
            'hue-3': '500' 
        });



        $mdDateLocaleProvider.months = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
        $mdDateLocaleProvider.shortMonths = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
        $mdDateLocaleProvider.days = ['niedziela','poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
        $mdDateLocaleProvider.shortDays = ['Nd','Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];

        $mdDateLocaleProvider.firstDayOfWeek = 1;
        $mdDateLocaleProvider.parseDate = function (dateString) {
            var m = moment(dateString, 'L', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
        $mdDateLocaleProvider.formatDate = function (date) {
            return moment(date).format('L');
        };
        $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
            return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' '+moment(date).year();
        };

    };
})();