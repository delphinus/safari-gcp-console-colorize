(() => {
    const colors = {
        'red': '#f44336',
        'pink': '#e91e63',
        'purple': '#9c27b0',
        'deep-purple': '#673ab7',
        'indigo': '#3f51b5',
        'blue': '#2196f3',
        'light-blue': '#03a9f4',
        'cyan': '#00bcd4',
        'teal': '#009688',
        'green': '#4caf50',
        'light-green': '#8bc34a',
        'lime': '#cddc39',
        'yellow': '#ffeb3b',
        'amber': '#ffc107',
        'orange': '#ff9800',
        'deep-orange': '#ff5722',
        'brown': '#795548',
        'grey': '#9e9e9e',
        'blue-grey': '#607d8b',
        'black': '#000000',
        'white': '#ffffff'
    };
    const randomColor = () => {
        const values = Object.values(colors);
        return values[Math.floor(Math.random() * values.length)];
    };
    const paletteWidth = 7;
    const palette = colors => Object.keys(colors).reduce((accumlator, key) => {
        const value = colors[key];
        const lastRow = accumlator[accumlator.length - 1];
        if (lastRow.length == paletteWidth) {
            const newRow = [value];
            accumlator.push(newRow);
        } else {
            lastRow.push(value);
        }
        return accumlator
    }, [[]]);
    const setSpectrum = ($element, value) => $element.val(value).spectrum({
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: 'もっと選ぶ',
        togglePaletteLessText: '既定色',
        showInitial: true,
        showInput: true,
        preferredFormat: 'hex',
        palette: palette(colors),
    });
    const start = options => {
        const phrases = options.phrases ? JSON.parse(options.phrases) : [{}];
        setEvents($('[data-phrase=0]'));
        setPhrases(phrases);
        setUseRegexp(options.useRegexp);
    };
    const setUseRegexp = useRegexp => $('[name=useRegexp]').prop({checked: !!useRegexp}).on('click', updateSettings);
    const getUseRegexp = () => $('[name=useRegexp]').is(':checked') ? 1 : 0;
    const updateSettings = () => {
        const phrases = $('[data-phrase]').toArray().reduce((accumlator, phrase) => {
            const index = $(phrase).data('phrase');
            const text = $(`[name=phrase-${index}]`).val();
            const fgColor = $(`[name=fgColor-${index}]`).val();
            const bgColor = $(`[name=bgColor-${index}]`).val();
            if (text.length && fgColor.length && bgColor.length) {
                accumlator.push({text, fgColor, bgColor});
            };
            return accumlator;
        }, []);
        Events.call({
            action: 'set-options',
            options: {
                useRegexp: getUseRegexp(),
                phrases: JSON.stringify(phrases.length ? phrases : [{}])
            }
        });
    };
    const setEvents = $row => {
        const $text = $('[data-phrase-text]', $row);
        const $fgColor = $('[data-fgColor-text]', $row);
        const $bgColor = $('[data-bgColor-text]', $row);
        $text.on('change', updateSettings);
        $fgColor.on('change', updateSettings);
        $bgColor.on('change', updateSettings);
        setSpectrum($fgColor, colors['white']);
        setSpectrum($bgColor, randomColor());
        $('[data-add-button]', $row).on('click', addRow);
        $('[data-delete-button]', $row).on('click', () => {
            $row.remove();
            updateSettings();
        });
    };
    const $original = $(`[data-phrase=0]`).clone();
    const addRow = () => {
        const index = $('[data-phrase]').last().data('phrase') + 1;
        const $newRow = $original.clone().attr({'data-phrase': index});
        $('[data-phrase-text]', $newRow).attr({
            id: `phrase-${index}`,
            name: `phrase-${index}`,
        });
        const $fgColor = $('[data-fgColor-text]', $newRow).attr({
            id: `fgColor-${index}`,
            name: `fgColor-${index}`
        });
        const $bgColor = $('[data-bgColor-text]', $newRow).attr({
            id: `bgColor-${index}`,
            name: `bgColor-${index}`
        });
        $('[data-add-button]', $newRow).attr({name: `add-${index}`});
        $('[data-delete-button]', $newRow).attr({name: `delete-${index}`}).removeAttr('disabled');
        setEvents($newRow);
        $('[data-phrase]').last().after($newRow);
    };
    const setPhrases = phrases => phrases.forEach((phrase, index) => {
        if (!$(`[data-phrase=${index}]`).length) {
            addRow();
        }
        $(`[name=phrase-${index}]`).val(phrase.text);
        $(`[name=fgColor-${index}]`).spectrum('set', phrase.fgColor);
        $(`[name=bgColor-${index}]`).spectrum('set', phrase.bgColor);
    });
    Events.call({action: 'get-options'}, start);
})();
