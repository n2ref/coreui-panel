//HEAD 
window["CoreUI"]["panel"]["tpl"] = {};

window["CoreUI"]["panel"]["tpl"]["container.html"] = "<div class=\"card text-center mb-3 shadow-sm\" id=\"coreui-panel-<%= id %>\">\n" +
    "    <div class=\"card-body text-start\">\n" +
    "        <% if (title) { %>\n" +
    "        <h4 class=\"card-title<% if ( ! subtitle) { %> mb-4<% } %>\">\n" +
    "            <% if (backUrl) { %>\n" +
    "            <a class=\"btn btn-sm btn-outline-secondary me-2 align-top\" href=\"<%- backUrl %>\">\n" +
    "                <svg class=\"align-text-top\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16px\" height=\"18px\" viewBox=\"0 0 24 24\" fill=\"none\">\n" +
    "                    <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z\" fill=\"#000000\"/>\n" +
    "                </svg>\n" +
    "            </a>\n" +
    "            <% } %>\n" +
    "            <%- title %>\n" +
    "        </h4>\n" +
    "        <% } %>\n" +
    "        <% if (subtitle) { %>\n" +
    "        <p class=\"text-muted\"><%- subtitle %></p>\n" +
    "        <% } %>\n" +
    "        <% if (controls) { %>\n" +
    "        <div class=\"position-absolute top-0 end-0 mt-3 me-3\"><%- controls %></div>\n" +
    "        <% } %>\n" +
    "\n" +
    "        <% if (typeof tabs === 'object' && tabs.length > 0) { %>\n" +
    "            <% if (tabsPosition === 'top-left' || tabsPosition === 'top-center' || tabsPosition === 'top-right') { %>\n" +
    "            <%- tabsContent %>\n" +
    "\n" +
    "            <div class=\"card-content\">\n" +
    "                <%- renderContent %>\n" +
    "            </div>\n" +
    "\n" +
    "            <% } else if (tabsPosition === 'left' || tabsPosition === 'left-sideways') { %>\n" +
    "            <div class=\"d-flex\">\n" +
    "                <div class=\"me-3\" style=\"width: <%= tabsWidth %>px\"><%- tabsContent %></div>\n" +
    "\n" +
    "                <div class=\"card-content flex-grow-1\">\n" +
    "                    <%- renderContent %>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <% } else if (tabsPosition === 'right' || tabsPosition === 'right-sideways') { %>\n" +
    "            <div class=\"d-flex\">\n" +
    "                <div class=\"card-content flex-grow-1 pe-3\">\n" +
    "                    <%- renderContent %>\n" +
    "                </div>\n" +
    "                <div style=\"width: <%= tabsWidth %>px\"><%- tabsContent %></div>\n" +
    "            </div>\n" +
    "            <% } %>\n" +
    "\n" +
    "        <% } else { %>\n" +
    "        <div class=\"card-content\">\n" +
    "            <%- renderContent %>\n" +
    "        </div>\n" +
    "        <% } %>\n" +
    "    </div>\n" +
    "</div>"; 

window["CoreUI"]["panel"]["tpl"]["tabs.html"] = "<% if (typeof tabs === 'object' && tabs.length > 0) { %>\n" +
    "<ul class=\"nav <% if (tabsType) { %>nav-<%= tabsType %><% } %> card-body-tabs mb-3 <% if (containerClasses) { %><%= containerClasses %><% } %>\n" +
    "           <% if (tabsFill) { %>nav-<%= tabsFill %><% } %>\">\n" +
    "    <% $.each(tabs, function(key, tab) { %>\n" +
    "        <% if (tab.type === 'tab') { %>\n" +
    "        <li class=\"nav-item\">\n" +
    "            <a class=\"nav-link<% if (tab.active) { %> active<% } %><% if (tab.disabled) { %> disabled<% } %>\" href=\"<% if (tab.url) { %><%= tab.url %><% } else { %>#<% } %>\" data-tab-id=\"<%= tab.id %>\" data-bs-toggle=\"tab\"><%= tab.title %></a>\n" +
    "        </li>\n" +
    "        <% } %>\n" +
    "        <% if (tab.type === 'dropdown') { %>\n" +
    "        <li class=\"nav-item dropdown<% if (tab.active) { %> active<% } %><% if (tab.disabled) { %> disabled<% } %>\">\n" +
    "            <a class=\"nav-link dropdown-toggle\" data-bs-toggle=\"dropdown\" href=\"#\">\n" +
    "                <%= tab.title %>\n" +
    "            </a>\n" +
    "            <ul class=\"dropdown-menu\">\n" +
    "                <% $.each(tab.items, function(key, item) { %>\n" +
    "                    <% if (item.type === 'item') { %>\n" +
    "                    <li>\n" +
    "                        <a class=\"dropdown-item<% if (item.active) { %> active<% } %><% if (item.disabled) { %> disabled<% } %>\" href=\"<% if (item.url) { %><%= item.url %><% } else { %>#<% } %>\" data-bs-toggle=\"tab\" data-tab-id=\"<%= item.id %>\">\n" +
    "                            <%= item.title %>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <% } %>\n" +
    "                    <% if (item.type === 'divider') { %>\n" +
    "                    <li>\n" +
    "                        <hr class=\"dropdown-divider\">\n" +
    "                    </li>\n" +
    "                    <% } %>\n" +
    "                <% }) %>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "        <% } %>\n" +
    "    <% }) %>\n" +
    "</ul>\n" +
    "<% } %>"; 
// END 