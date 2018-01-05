/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here.
    // For complete reference see:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    // The toolbar groups arrangement, optimized for two toolbar rows.
    config.extraPlugins = 'colorbutton,font,justify';
    config.contentsCss = '/Content/css/fonts.css';
    config.font_names = 'Roboto;Noto Sans SC;' +
        'Polya;' +
        'Arial/Arial, Helvetica, sans-serif;' +
        'Times New Roman/Times New Roman, Times, serif;' +
        'Initial/initial;' +
        'Verdana;';

    config.toolbarGroups = [
      //  { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'tools' },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
        { name: 'links'},
        { name: 'insert' },
        //{ name: 'forms' },
        
        //{ name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
       // '/',
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
        { name: 'pbckcode' },
        { name: 'colorbutton' },
        { name: 'colors' }



    ];

    // Remove some buttons provided by the standard plugins, which are
    // not needed in the Standard(s) toolbar.
    config.removeButtons = 'Underline,Subscript,Superscript';

    // Set the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';

    // Simplify the dialog windows.
    config.removeDialogTabs = 'image:advanced;link:advanced';

    //code
    config.pbckcode = {
        // An optional class to your pre tag.
        cls: '',
        // The syntax highlighter you will use in the output view
        highlighter: 'PRETTIFY',
        // An array of the available modes for you plugin.
        // The key corresponds to the string shown in the select tag.
        // The value correspond to the loaded file for ACE Editor.
        modes: [['HTML', 'html'], ['CSS', 'css'], ['PHP', 'php'], ['JS', 'javascript'], ['XML', 'xml'], ['Java', 'java'],
            ['JSON', 'json'], ['C#', 'csharp'], ['SQL', 'sql'], ['C/C++', 'c_cpp'], ['SH', 'sh']],
        // The theme of the ACE Editor of the plugin.
        theme: 'chrome',
        // Tab indentation (in spaces)
        tab_size: '4'
    };
};
