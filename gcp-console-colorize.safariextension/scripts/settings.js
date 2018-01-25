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
    const paletteWidth = 4;
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
    const setSpectrum = ($element, value) => $element.val(value || colors['red']).spectrum({
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
            const color = $(`[name=color-${index}]`).val();
            if (text.length && color.length) {
                accumlator.push({text, color});
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
        const $text = $('[data-color-text]', $row);
        const $color = $('[data-color-text]', $row);
        $text.on('change', updateSettings);
        $color.on('change', updateSettings);
        setSpectrum($color);
        $('[data-add-button]', $row).on('click', addRow);
        $('[data-delete-button]', $row).on('click', () => $row.remove());
    };
    const $original = $(`[data-phrase=0]`).clone();
    const addRow = () => {
        const index = $('[data-phrase]').last().data('phrase') + 1;
        const $newRow = $original.clone().attr({'data-phrase': index});
        $('[data-phrase-text]', $newRow).attr({
            id: `phrase-${index}`,
            name: `phrase-${index}`,
        });
        const $color = $('[data-color-text]', $newRow).attr({
            id: `color-${index}`,
            name: `color-${index}`
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
        $(`[name=color-${index}]`).spectrum('set', phrase.color);
    });
    Events.call({action: 'get-options'}, start);
})();
