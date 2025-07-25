import { ApproxStructure, Assertions } from '@ephox/agar';
import { Disabling, GuiFactory, Representing } from '@ephox/alloy';
import { describe, it } from '@ephox/bedrock-client';
import { Optional } from '@ephox/katamari';
import { assert } from 'chai';

import { renderTextarea } from 'tinymce/themes/silver/ui/dialog/TextField';

import * as GuiSetup from '../../../module/GuiSetup';
import * as RepresentingUtils from '../../../module/RepresentingUtils';
import TestProviders from '../../../module/TestProviders';

describe('headless.tinymce.themes.silver.components.textarea.TextareaTest', () => {
  const hook = GuiSetup.bddSetup((_store, _doc, _body) => GuiFactory.build(
    renderTextarea({
      context: 'any',
      name: 'textarea',
      label: Optional.some('LabelA'),
      placeholder: Optional.none(),
      maximized: false,
      enabled: true,
      spellcheck: Optional.from(true),
    }, TestProviders, Optional.none())
  ));

  // TODO: Fix dupe with Input test. Test Ctrl+Enter.
  it('Check basic structure', () => {
    Assertions.assertStructure(
      'Checking initial structure',
      ApproxStructure.build((s, str, arr) => s.element('div', {
        classes: [ arr.has('tox-form__group') ],
        children: [
          s.element('label', {
            classes: [ arr.has('tox-label') ],
            html: str.is('LabelA')
          }),
          s.element('div', {
            classes: [ arr.has('tox-textarea-wrap') ],
            children: [
              s.element('textarea', {
                classes: [ arr.has('tox-textarea') ],
                attrs: {
                  'data-alloy-tabstop': str.is('true'),
                  'spellcheck': str.is('true'),
                }
              })
            ]
          })
        ]
      })),
      hook.component().element
    );
  });

  it('Representing state', () => {
    const component = hook.component();
    Representing.setValue(component, 'New-Value');
    RepresentingUtils.assertComposedValue(component, 'New-Value');
  });

  it('Disabling state', () => {
    const component = hook.component();
    assert.isFalse(Disabling.isDisabled(component), 'Initial disabled state');
    Disabling.set(component, true);
    assert.isTrue(Disabling.isDisabled(component), 'enabled > disabled');
  });
});
