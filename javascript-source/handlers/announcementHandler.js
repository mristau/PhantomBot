/*
 * Copyright (C) 2016-2024 phantombot.github.io/PhantomBot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global Packages */

/*
 * This module is to handle online and offline events from Twitch.
 */
(function () {
  var onlineToggle = $.getSetIniDbBoolean('announcementSettings', 'onlineToggle', false),
    onlineMessage = $.getSetIniDbString('announcementSettings', 'onlineMessage', '(name) ist jetzt live! Heute gibt es (game): (title)');

  function resetAnnouncement() {
    onlineToggle = false;
    onlineMessage = '(name) ist jetzt live! Heute gibt es (game): (title)';
    $.setIniDbBoolean('announcementSettings', 'onlineToggle', onlineToggle);
    $.setIniDbString('announcementSettings', 'onlineMessage', onlineMessage);
  }

    /*
     * @function reloadAnnouncement
     */
    function reloadAnnouncement() {
      toggle = $.getIniDbBoolean('announcementSettings', 'onlineToggle', false);
      message = $.getIniDbString('announcementSettings', 'onlineMessage', '(name) ist jetzt live! Heute gibt es (game): (title)');
  }

  /*
   * @event twitchOnline
   */
  $.bind('twitchOnline', function (event) {
    if (onlineToggle === true) {
      var s = onlineMessage;

      if (s.match(/\(name\)/)) {
        s = $.replace(s, '(name)', $.viewer.broadcaster().name());
      }

      if (s.match(/\(game\)/)) {
        s = $.replace(s, '(game)', $.twitchcache.getGameTitle());
      }

      if (s.match(/\(title\)/)) {
        s = $.replace(s, '(title)', $.twitchcache.getStreamStatus());
      }

      $.say(s);
    }
  });

  /*
   * @event command
   */
  $.bind('command', function (event) {
    var sender = event.getSender(),
      command = event.getCommand(),
      args = event.getArgs(),
      action = args[0],
      subAction = args[1];
    /*
     * @commandpath announcement
     */
    if ($.equalsIgnoreCase(command, 'announcement')) {
      if (action === undefined) {
        $.say($.lang.get('announcementhandler.usage'));
        return;
      } else {
        /*
         * @commandpath announcement toggleonline - enable/disable online announcement twitch
         */
        if ($.equalsIgnoreCase(action, 'toggleonline')) {
          onlineToggle = !onlineToggle;
          $.setIniDbBoolean('announcementSettings', 'onlineToggle', onlineToggle);
          $.say(onlineToggle ? $.lang.get('announcementhandler.onlinetoggle.on') : $.lang.get('announcementhandler.onlinetoggle.off'));

          return;
        }

        /*
         * @commandpath announcement onlinemessage - set announcement message
         */
        if ($.equalsIgnoreCase(action, 'onlinemessage')) {
          if (subAction === undefined) {
            $.say($.lang.get('announcementhandler.onlinemessage.usage'));
            return;
          }

          newOnlineMessage = args.slice(1).join(' ');
          $.say($.whisperPrefix(sender) + newOnlineMessage);
          $.setIniDbString('announcementSettings', 'onlinemessage', newOnlineMessage);
          $.say($.lang.get('announcementhandler.onlinemessage.success'));

          return;
        }

        /*
         * @commandpath announcement reset - reset announcement message
         */
        if ($.equalsIgnoreCase(action, 'reset')) {
          resetAnnouncement();
          $.say($.lang.get('announcementhandler.onlinemessage.reset'))
          return;
        }
      }
    }
  });

  /*
   * @event initReady
   */
  $.bind('initReady', function () {
    $.registerChatCommand('./handlers/announcementHandler.js', 'announcement', $.PERMISSION.Mod);
    $.registerChatSubcommand('announcement', 'toggleonline', $.PERMISSION.Mod);
    $.registerChatSubcommand('announcement', 'onlinemessage', $.PERMISSION.Mod);
    $.registerChatSubcommand('announcement', 'reset', $.PERMISSION.Mod);
  });

  $.reloadAnnouncement = reloadAnnouncement;
})();
