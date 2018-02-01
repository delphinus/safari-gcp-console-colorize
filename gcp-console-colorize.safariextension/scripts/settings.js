(() => {
    class Palette {
        constructor() {
            this.width = 7;
            this.defaultColor = '#3b78e7';
            this.colors = {
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
        }

        randomColor() {
            const values = Object.values(this.colors);
            return values[Math.floor(Math.random() * values.length)];
        }

        matrix() {
            return Object.keys(this.colors).reduce((accumlator, key) => {
                const value = this.colors[key];
                const lastRow = accumlator[accumlator.length - 1];
                if (lastRow.length === this.width) {
                    const newRow = [value];
                    accumlator.push(newRow);
                } else {
                    lastRow.push(value);
                }
                return accumlator;
            }, [[]]);
        }

        spectrum($element, value) {
            $element.val(value).spectrum({
                showPaletteOnly: true,
                togglePaletteOnly: true,
                togglePaletteMoreText: 'もっと選ぶ',
                togglePaletteLessText: '既定色',
                showInitial: true,
                showInput: true,
                preferredFormat: 'hex',
                palette: this.matrix(),
            });
        }
    }

    const start = options => {
        const palette = new Palette;
        let phrases;
        try {
            phrases = JSON.parse(options.phrases);
        } catch (e) {
            phrases = [{}];
        }
        setResetEvent($('[name=reset]'));
        setEvents($('[data-phrase=0]'), palette);
        setPhrases(phrases, palette);
        setUseRegexp(options.useRegexp);
    };
    const setResetEvent = $button => $button.on('click', () => Events.call(
        {
            action: 'set-options',
            options: {
                useRegexp: false,
                phrases: []
            }
        },
        () => window.location.reload()
    ));
    const setUseRegexp = useRegexp => $('[name=useRegexp]').prop({checked: !!useRegexp}).on('change', updateSettings);
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
    const setEvents = ($row, palette) => {
        const $text = $('[data-phrase-text]', $row);
        const $fgColor = $('[data-fgColor-text]', $row);
        const $bgColor = $('[data-bgColor-text]', $row);
        $text.on('change', updateSettings);
        $fgColor.on('change', updateSettings);
        $bgColor.on('change', updateSettings);
        palette.spectrum($fgColor, palette.colors.white);
        palette.spectrum($bgColor, palette.randomColor());
        $('[data-add-button]', $row).on('click', () => addRow(palette));
        $('[data-delete-button]', $row).on('click', () => {
            $row.remove();
            updateSettings();
        });
    };
    const $original = $(`[data-phrase=0]`).clone();
    const addRow = palette => {
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
        setEvents($newRow, palette);
        $('[data-phrase]').last().after($newRow);
    };
    const setPhrases = (phrases, palette) => phrases.forEach((phrase, index) => {
        if (!$(`[data-phrase=${index}]`).length) {
            addRow(palette);
        }
        $(`[name=phrase-${index}]`).val(phrase.text);
        $(`[name=fgColor-${index}]`).spectrum('set', phrase.fgColor || palette.colors.white);
        $(`[name=bgColor-${index}]`).spectrum('set', phrase.bgColor || palette.defaultColor);
    });
    Events.call({action: 'get-options'}, start);
})();
