document.addEventListener('DOMContentLoaded', function () {

    // Simple panel
    CoreUI.panel.create({
        title: "Component Panel",
        subtitle: "CoreUI Framework",
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    }).render('panel-simple');


    // Inset components
    CoreUI.panel.create({
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
    }).render('panel-inset-components');


    // Controls
    CoreUI.panel.create({
        title: "Title",
        controls: [
            { type: "custom", content: "<div class=\"py-2\"><em>Custom content</em></div>" },
            { type: "link",   content: "Link", href: "/link-url", attr: {class: 'btn btn-success'}, onClick: function () { return false } },
            { type: "button", attr: {class: "btn btn-outline-secondary" }, content: "Button", onClick: function () {console.log(1) } },
            { type: "dropdown", content: "Dropdown", attr: { class: 'btn btn-primary dropdown-toggle' }, position: 'end',
                items: [
                    { type: 'link',   content: 'Link', link: "#" },
                    { type: 'button', content: 'Button 1', onClick: function (event, panel) { console.log(2) } },
                    { type: 'divider' },
                    { type: 'button', content: 'Button 2', onClick: function (event, panel) { console.log(3) } },
                ]
            },
            { type: "button_group", attr: { class: 'btn-group' },
                buttons: [
                    { type: "link",     content: "Link",     attr: { class: 'btn btn-secondary' }, link: "#" },
                    { type: "button",   content: "Button",   attr: { class: 'btn btn-secondary' }, onClick: function (event, table) { console.log(4) } },
                    { type: "dropdown", content: "Dropdown", attr: { class: 'btn btn-secondary dropdown-toggle' }, position: 'end',
                        items: [
                            { type: 'link',   content: 'Link', link: "#" },
                            { type: 'button', content: 'Button 1', onClick: function (event, panel) { console.log(5) } },
                            { type: 'divider' },
                            { type: 'button', content: 'Button 2', onClick: function (event, panel) { console.log(6) } },
                        ]
                    },
                ]
            }
        ],
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    }).render('panel-controls');


    // Tabs panel
    let panelTabs = CoreUI.panel.create({
        id: 'tabs',
        title: "Component Panel",
        subtitle: "CoreUI Framework",
        tabs: {
            items: [
                { id: "1", title: "Home", active: true },
                { id: "2", title: "Profile" },
                { id: "3", title: "Disabled", disabled: true },
                {
                    title: "Dropdown",
                    type: "dropdown",
                    items: [
                        { id: "4", title: "Tab title 4", disabled: true},
                        { id: "5", title: "Tab title 5"},
                        { type: "divider"},
                        { id: "6", title: "Tab title 6"}
                    ]
                }
            ]
        },
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    });

    panelTabs.render('panel-tabs');
    panelTabs.on('tab_click', function (tab, event) {
        this.setContent( tab.getOptions().title );
    });


    // Pills panel
    let panelPills = CoreUI.panel.create({
        tabs: {
            type: 'pills',
            items: [
                { id: "1", title: "Home", active: true },
                { id: "2", title: "Profile"},
                { id: "3", title: "Disabled", disabled: true},
                {
                    title: "Dropdown",
                    type: "dropdown",
                    items: [
                        { id: "4", title: "Tab title 4", disabled: true},
                        { id: "5", title: "Tab title 5"},
                        { type: "divider"},
                        { id: "6", title: "Tab title 6"}
                    ]
                }
            ]
        },
        content: [ "Tab Home" ]
    });

    panelPills.render('panel-pills');
    panelPills.on('tab_click', function (tab, event) {
        this.setContent( tab.getOptions().title );
    });


    // underline panel
    let panelUnderline = CoreUI.panel.create({
        tabs: {
            type: 'underline',
            items: [
                { id: "1", title: "Home", active: true},
                { id: "2", title: "Profile" },
                { id: "3", title: "Disabled", disabled: true},
                {
                    title: "Dropdown",
                    type: "dropdown",
                    items: [
                        { id: "4", title: "Tab title 4", disabled: true},
                        { id: "5", title: "Tab title 5" },
                        { type: "divider"},
                        { id: "6", title: "Tab title 6" }
                    ]
                }
            ]
        },
        content: [ "Tab Home" ]
    });

    panelUnderline.render('panel-underline');
    panelUnderline.on('tab_click', function (tab, event) {
        this.setContent( tab.getOptions().title );
    });


    // fill
    let panelFill = CoreUI.panel.create({
        tabs: {
            type: 'tabs',
            fill: 'fill',
            items: [
                {id: "1", title: "Active", active: true},
                {id: "2", title: "Much longer nav link"},
                {id: "3", title: "Link"},
                {id: "3", title: "Disabled", disabled: true},
            ]
        },
        content: [ "Tab Home" ]
    });

    panelFill.render('panel-fill');
    panelFill.on('tab_click', function (tab, event) {
        this.setContent( tab.getOptions().title );
    });


    // justify
    let panelJustify = CoreUI.panel.create({
        tabs: {
            type: 'tabs',
            fill: 'justified',
            items: [
                {id: "1", title: "Active", active: true},
                {id: "2", title: "Much longer nav link"},
                {id: "3", title: "Link"},
                {id: "3", title: "Disabled", disabled: true},
            ]
        },
        content: [ "Tab Home" ]
    });

    panelJustify.render('panel-justify');
    panelJustify.on('tab_click', function (tab, event) {
        this.setContent( tab.getOptions().title );
    });


    // Positions left
    let panelLeft = CoreUI.panel.create({
        tabs: {
            position: 'left',
            width: 200,
            items: [
                { id: "1", title: "Home", active: true },
                { id: "2", title: "Profile" },
                { id: "3", title: "Disabled", disabled: true },
                {
                    title: "Dropdown",
                    type: "dropdown",
                    items: [
                        { id: "4", title: "Tab title 4", disabled: true },
                        { id: "5", title: "Tab title 5" },
                        { type: "divider"},
                        { id: "6", title: "Tab title 6" }
                    ]
                }
            ]
        },
        content: [ "Tab Home" ]
    });

    panelLeft.render('panel-pos-left');
    panelLeft.on('tab_click', function (tab, event) {
        this.setContent( tab.getOptions().title );
    });

    // Positions right
    let panelRight = CoreUI.panel.create({
        tabs: {
            position: 'right',
            width: 200,
            items: [
                { id: "1", title: "Home", active: true },
                { id: "2", title: "Profile" },
                { id: "3", title: "Disabled", disabled: true },
                {
                    title: "Dropdown",
                    type: "dropdown",
                    items: [
                        { id: "4", title: "Tab title 4", disabled: true},
                        { id: "5", title: "Tab title 5" },
                        { type: "divider" },
                        { id: "6", title: "Tab title 6" }
                    ]
                }
            ]
        },
        content: [ "Tab Home" ]
    });

    panelRight.render('panel-pos-right');
    panelRight.on('tab_click', function (tab, event) {
        this.setContent( tab.getOptions().title );
    });


    // Ajax
    let panelAjax = CoreUI.panel.create({
        id: "ajax",
        title: "Component Panel",
        subtitle: "CoreUI Framework",
        tabs: {
            items: [
                { id: "tab1", title: "Home", active: true, urlContent: "data/tab1.txt" },
                { id: "tab2", title: "Profile",            urlContent: "data/tab2.json" },
                { id: "tab3", title: "Disabled", disabled: true},
                {
                    title: "Dropdown",
                    type: "dropdown",
                    items: [
                        { id: "tab4", title: "Tab title 3", disabled: true},
                        { id: "tab5", title: "Tab title 4", urlContent: "data/tab3.json" },
                        { type: "divider"},
                        { id: "tab6",title: "Tab title 5", urlContent: "data/tab4.json"}
                    ]
                }
            ]
        },
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    });

    panelAjax.render('panel-ajax');
    panelAjax.on('tab_click', function (tab, event) {
        console.log(tab.getId() + ' ' + 'tab_click')
    });
    panelAjax.on('load_start', function (xhr) {
        console.log('load_start')
    });
    panelAjax.on('load_success', function (result) {
        console.log('load_success')
    });
    panelAjax.on('load_error', function (xhr, textStatus, errorThrown ) {
        console.log('load_error')
    });
    panelAjax.on('load_end', function (xhr) {
        console.log('load_end')
    });


    // Count simple
    CoreUI.panel.create({
        tabs: {
            items: [
                { id: "tab1", title: "Users", count: 3, active: true },
                { id: "tab2", title: "Issues", count: 18 },
                { id: "tab3", title: "Actions" }
            ]
        },
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    }).render('panel-tabs-count');


    // Count load
    CoreUI.panel.create({
        load: "data/tabs.json",
        tabs: {
            items: [
                { id: "tab1", title: "Tab1", urlCount: "data/count/tab1.json", active: true },
                { id: "tab2", title: "Tab2", urlCount: "data/count/tab2.json" },
                { id: "tab3", title: "Tab3"}
            ]
        },
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    }).render('panel-tabs-count-load');


    // Badge simple
    CoreUI.panel.create({
        tabs: {
            items: [
                { id: "tab1", title: "Orders", badge: { text: '', type: 'success' }, active: true },
                { id: "tab2", title: "Profile" },
                { id: "tab3", title: "Messages", badge: { text: '99+', type: 'danger', attr: { title: 'Unread messages'} } },
            ]
        },
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    }).render('panel-tabs-badge');


    // Badge simple load
    CoreUI.panel.create({
        tabs: {
            items: [
                { id: "tab1", title: "Orders", urlBadge: "data/badges/tab1.json", active: true },
                { id: "tab2", title: "Profile" },
                { id: "tab3", title: "Messages", urlBadge: "data/badges/tab3.json" },
            ]
        },
        content: "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui."
    }).render('panel-tabs-badge-load');

    // Code highlight
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
});