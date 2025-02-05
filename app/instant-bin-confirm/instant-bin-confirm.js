/* global
gPopupClickShield
enums
EADialogViewController
services
utils
*/

import { BaseScript } from '../core';
import { InstantBinConfirmSettings } from './settings-entry';

export class InstantBinConfirm extends BaseScript {
  unmodifiedConfirmation = utils.PopupManager.showConfirmation;

  constructor() {
    super(InstantBinConfirmSettings.id);
  }

  activate(state) {
    super.activate(state);
  }

  onScreenRequest(screenId) {
    super.onScreenRequest(screenId);
    const settings = this.getSettings();

    utils.PopupManager.showConfirmation = (dialog, amount, proceed, s) => {
      let cancel = s;
      if (typeof s !== 'function') {
        cancel = function () { };
      }

      if (settings.isActive && dialog.title ===
        utils.PopupManager.Confirmations.CONFIRM_BUY_NOW.title) {
        proceed();
        return;
      }

      const n = new EADialogViewController({
        dialogOptions: [dialog.buttonLabels[0],
          dialog.buttonLabels[1]],
        message: services.Localization.localize(dialog.message, amount),
        title: services.Localization.localize(dialog.title),
      });

      n.init();
      gPopupClickShield.setActivePopup(n);
      n.onExit.observe(this, (e, t) => {
        if (t !== enums.UIDialogOptions.CANCEL && t !== enums.UIDialogOptions.NO) {
          if (proceed) {
            proceed();
          } else if (cancel) {
            cancel();
          }
        } else {
          cancel();
        }
      });
    };
  }

  deactivate(state) {
    super.deactivate(state);
    utils.PopupManager.showConfirmation = this.unmodifiedConfirmation;
  }
}
