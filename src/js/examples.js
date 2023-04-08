document.addEventListener('DOMContentLoaded', function () {

    // Simple panel
    let panelSimple = CoreUI.panel.create({
        title: "Component Panel",
        subtitle: "CoreUI Framework",
        controls: "<button class=\"btn btn-sm btn-outline-secondary\">Help<\/button>",
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    });

    panelSimple.render('example-simple-content');


    // Inset components
    let panelInsetComponents = CoreUI.panel.create({
        id: "components",
        title: "Component Panel",
        subtitle: "CoreUI Framework",
        content: [
            "Your content 1 <br><br>",
            {
                component:  "coreui.panel",
                title: "Sub Panel",
                content: "Your content 3"
            }
        ]
    });
    let html = panelInsetComponents.render();
    $('#example-inset-components-content').html(html);
    panelInsetComponents.initEvents();


    // Tabs panel
    let panelTabs = CoreUI.panel.create({
        title: "Component Panel",
        subtitle: "CoreUI Framework",
        backUrl: "#",
        controls: "<button class=\"btn btn-sm btn-outline-secondary\">Help<\/button>",
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true},
            {
                title: "Dropdown",
                type: "dropdown",
                items: [
                    {id: "4", title: "Tab title 4", disabled: true},
                    {id: "5", title: "Tab title 5", active: false},
                    {type: "divider"},
                    {id: "6", title: "Tab title 6", active: false}
                ]
            }
        ],
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    });

    panelTabs.render('example-tabs-content');
    panelTabs.on('click-tab.coreui.panel', function (tab, event) {
        panelTabs.setContent('Tab ' + tab.title);
    });


    // Pills panel
    let panelPills = CoreUI.panel.create({
        tabsType: 'pills',
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true},
            {
                title: "Dropdown",
                type: "dropdown",
                items: [
                    {id: "4", title: "Tab title 4", disabled: true},
                    {id: "5", title: "Tab title 5", active: false},
                    {type: "divider"},
                    {id: "6", title: "Tab title 6", active: false}
                ]
            }
        ],
        content: [ "Tab Home" ]
    });

    panelPills.render('example-pills-content');
    panelPills.on('click-tab.coreui.panel', function (tab, event) {
        panelPills.setContent('Tab ' + tab.title);
    })


    // underline panel
    let panelUnderline = CoreUI.panel.create({
        tabsType: 'underline',
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true},
            {
                title: "Dropdown",
                type: "dropdown",
                items: [
                    {id: "4", title: "Tab title 4", disabled: true},
                    {id: "5", title: "Tab title 5", active: false},
                    {type: "divider"},
                    {id: "6", title: "Tab title 6", active: false}
                ]
            }
        ],
        content: [ "Tab Home" ]
    });

    panelUnderline.render('example-underline-content');
    panelUnderline.on('click-tab.coreui.panel', function (tab, event) {
        panelUnderline.setContent('Tab ' + tab.title);
    });


    // fill
    let panelFill = CoreUI.panel.create({
        tabsType: 'tabs',
        tabsFill: 'fill',
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true},
            {
                title: "Dropdown",
                type: "dropdown",
                items: [
                    {id: "4", title: "Tab title 4", disabled: true},
                    {id: "5", title: "Tab title 5", active: false},
                    {type: "divider"},
                    {id: "6", title: "Tab title 6", active: false}
                ]
            }
        ],
        content: [ "Tab Home" ]
    });

    panelFill.render('example-fill-content');
    panelFill.on('click-tab.coreui.panel', function (tab, event) {
        panelJustify.setContent('Tab ' + tab.title);
    });

    // justify
    let panelJustify = CoreUI.panel.create({
        tabsType: 'tabs',
        tabsFill: 'justified',
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true},
            {
                title: "Dropdown",
                type: "dropdown",
                items: [
                    {id: "4", title: "Tab title 4", disabled: true},
                    {id: "5", title: "Tab title 5", active: false},
                    {type: "divider"},
                    {id: "6", title: "Tab title 6", active: false}
                ]
            }
        ],
        content: [ "Tab Home" ]
    });

    panelJustify.render('example-justify-content');
    panelJustify.on('click-tab.coreui.panel', function (tab, event) {
        panelJustify.setContent('Tab ' + tab.title);
    });


    // Positions left
    let panelLeft = CoreUI.panel.create({
        tabsPosition: 'left',
        tabsWidth: 200,
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true},
            {
                title: "Dropdown",
                type: "dropdown",
                items: [
                    {id: "4", title: "Tab title 4", disabled: true},
                    {id: "5", title: "Tab title 5", active: false},
                    {type: "divider"},
                    {id: "6", title: "Tab title 6", active: false}
                ]
            }
        ],
        content: [ "Tab Home" ]
    });

    panelLeft.render('example-pos-left-content');
    panelLeft.on('click-tab.coreui.panel', function (tab, event) {
        panelLeft.setContent('Tab ' + tab.title);
    });


    // Positions left sideways
    let panelLeftSideways = CoreUI.panel.create({
        tabsPosition: 'left-sideways',
        tabsWidth: 65,
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true}
        ],
        content: [ "Tab Home" ]
    });

    panelLeftSideways.render('example-pos-left-sideways-content');
    panelLeftSideways.on('click-tab.coreui.panel', function (tab, event) {
        panelLeftSideways.setContent('Tab ' + tab.title);
    });


    // Positions right
    let panelRight = CoreUI.panel.create({
        tabsPosition: 'right',
        tabsWidth: 200,
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true},
            {
                title: "Dropdown",
                type: "dropdown",
                items: [
                    {id: "4", title: "Tab title 4", disabled: true},
                    {id: "5", title: "Tab title 5", active: false},
                    {type: "divider"},
                    {id: "6", title: "Tab title 6", active: false}
                ]
            }
        ],
        content: [ "Tab Home" ]
    });

    panelRight.render('example-pos-right-content');
    panelRight.on('click-tab.coreui.panel', function (tab, event) {
        panelRight.setContent('Tab ' + tab.title);
    });



    // Positions right sideways
    let panelRightSideways = CoreUI.panel.create({
        tabsPosition: 'right-sideways',
        tabsWidth: 25,
        tabs: [
            {id: "1", title: "Home", active: true},
            {id: "2", title: "Profile", active: false},
            {id: "3", title: "Disabled", disabled: true},
        ],
        content: [ "Tab Home" ]
    });

    panelRightSideways.render('example-pos-right-sideways-content');
    panelRightSideways.on('click-tab.coreui.panel', function (tab, event) {
        panelRightSideways.setContent('Tab ' + tab.title);
    });


    // Ajax panel
    let panelAjax = CoreUI.panel.create({
        id: "ajax",
        title: "Component Panel",
        subtitle: "CoreUI Framework",
        tabs: [
            {id: "tab1", title: "Home", active: true, url: "data/tab1.txt"},
            {id: "tab2", title: "Profile", active: false, url: "data/tab2.json"},
            {id: "tab3", title: "Disabled", disabled: true},
            {
                title: "Dropdown",
                type: "dropdown",
                items: [
                    {id: "tab4", title: "Tab title 3", disabled: true},
                    {id: "tab5", title: "Tab title 4", active: false, url: "data/tab3.json"},
                    {type: "divider"},
                    {id: "tab6",title: "Tab title 5", active: false, url: "data/tab4.json"}
                ]
            }
        ],
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    });

    panelAjax.render('example-ajax-content');
    panelAjax.on('click-tab.coreui.panel', function (tab, event) {
        console.log(tab.id + ' ' + 'click-tab.coreui.panel')
    });
    panelAjax.on('start-load-content.coreui.panel', function (tab, xhr) {
        console.log(tab.id + ' ' + 'start-load-content.coreui.panel')
    });
    panelAjax.on('success-load-content.coreui.panel', function (tab, result) {
        console.log(tab.id + ' ' + 'success-load-content.coreui.panel')
    });
    panelAjax.on('error-load-content.coreui.panel', function (tab, xhr, textStatus, errorThrown ) {
        console.log(tab.id + ' ' + 'error-load-content.coreui.panel')
    });
    panelAjax.on('end-load-content.coreui.panel', function (tab, xhr) {
        console.log(tab.id + ' ' + 'end-load-content.coreui.panel')
    });


    // Code highlight
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
});