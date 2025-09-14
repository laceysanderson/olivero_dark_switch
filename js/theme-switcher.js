/**
 * @file
 * Javascript to switch between light and dark mode.
 *
 * More specifically, this script
 * - manages the flipping between moon/sun on the #theme-switch button.
 * - adds a light/dark class to the HTML tag.
 * - sets the theme mode based on the prefers-color-scheme media tag if it
 *   has not yet been set manually in this users session.
 */
(function (Drupal, once) {
  /**
 * Attaches the theme mode toggle behaviour to the #theme-switch button.
 *
 * @type {Drupal~behavior}
 *
 * @prop {Drupal~behaviorAttach} attach
 *   Adds a click listener to the #theme-switch button that changes between
 *   light and dark mode when clicked. See the file docblock for the specifics
 *   of how each action that entails.
 */
  Drupal.behaviors.toliveroDarkSwitchThemeModeToggle = {
    attach(context) {

      // 1. Grab what we need from the DOM and system settings on page load.
      const button = document.querySelector("[data-theme-toggle]");
      const localStorageTheme = localStorage.getItem("theme");
      const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

      // 2. Work out the current site settings.
      let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

      // 3. Update the theme setting and button according to current settings.
      updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
      updateThemeOnHtmlEl({ theme: currentThemeSetting });

      // 4. Add an event listener to toggle the theme.
      button.addEventListener("click", (event) => {
        const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

        localStorage.setItem("theme", newTheme);
        updateButton({ buttonEl: button, isDark: newTheme === "dark" });
        updateThemeOnHtmlEl({ theme: newTheme });

        currentThemeSetting = newTheme;
      });

      /**
       * Determines the current theme mode based on local storage + system mode.
       *
       * Note: If the local storage is not set then it will fallback on the
       * system settings (i.e. prefers-color-scheme media tag).
       *
       * @param {string} localStorageTheme
       *   The value of the theme data tag in local storage.
       * @param {MediaQueryList} systemSettingDark
       *   The value of the prefers-color-scheme media tag.
       *
       * @return {string}
       *   The string "dark" to indicate dark mode should be enabled or the
       *   string "light" to indicate the light mode should be enabled.
       */
      function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
        if (localStorageTheme !== null) {
          return localStorageTheme;
        }

        if (systemSettingDark.matches) {
          return "dark";
        }

        return "light";
      }

      /**
       * Update the aria-label and svg icon visibility base on theme mode.
       *
       * @param {Element} buttonEl
       *   The button to be updated (i.e. the #theme-switch button).
       * @param {bool} isDark
       *   TRUE if the current theme mode is "dark" and FALSE otherwise.
       *
       * @return {Element}
       *   The updated button element.
       */
      function updateButton({ buttonEl, isDark }) {
        const newAria = isDark ? "Change to light theme" : "Change to dark theme";

        // Use an aria-label to make it clear for screen readers.
        buttonEl.setAttribute("aria-label", newAria);

        // Indicate the inner icon based on the theme mode.
        updateSunMoonIcon({parentButton: buttonEl, isDark: isDark });

        return buttonEl;
      }

      /**
       * Updates visibility of both the sun and moon icons based on theme mode.
       *
       * @param {Element} parentButton
       *   The #theme-switch button element which contains the icons to update.
       * @param {bool} isDark
       *   TRUE if the current theme mode is "dark" and FALSE otherwise.
       *
       * @return {Element}
       *   The icon which is currently active. For example, if the theme mode is
       *   dark then the sun icon is returned, but if it is light then the
       *   moon icon is returned.
       */
      function updateSunMoonIcon({parentButton, isDark}) {
        let sunIcon = document.querySelector('#theme-switch-sun');
        let moonIcon = document.querySelector('#theme-switch-moon');

        // If we are using dark mode then the sun should be visible.
        if (isDark) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
          // Also add sun class to parent button for easy styling.
          parentButton.classList.add('sun');
          parentButton.classList.remove('moon');
        }
        // Otherwise, using light mode so the moon should be visible.
        else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
          // Also add moon class to parent button for easy styling.
          parentButton.classList.remove('sun');
          parentButton.classList.add('moon');
        }

        return isDark ? sunIcon : moonIcon;
      }

      /**
       * Updates the theme data attribute on the html tag.
       *
       * @param {string} theme
       *   Either "dark" if the theme mode is dark or "light" otherwise.
       *
       * @return {Element}
       *   The html tag element that was updated.
       */
      function updateThemeOnHtmlEl({ theme }) {
        let element  = document.querySelector("html");
        element.setAttribute("data-theme", theme);
        return element;
      }
    }
  };
}(Drupal, once));
