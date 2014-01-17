var updateBlockedUsers = function() {
    var $select = $('select[name=blocked_users]');
    $select.empty();
    getBlockedUsers(function(users) {
        _.each(users, function(user) {
            var $option = $('<option>')
                .val(user)
                .text(user);
            $select.append($option);
        });
    });
}

var updateBlockedMessageActions = function() {
    getMessageAction(function(action) {
        $('input[name=blocked_message_action][checked=checked]').removeAttr('checked');
        $('input[name=blocked_message_action][value=' + action + ']').attr('checked', 'checked');
    });
}

$(function() {

    updateBlockedUsers();
    updateBlockedMessageActions();

    $('input[name=blocked_message_action]').click(function() {
        var action = $(this).val();
        setMessageAction(action);
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'CHANGEBLOCKSTYLE',
                style: action,
            });
        });
    });

    var $select = $('select[name=blocked_users]');

    $select.change(function(e) {
        if ($select.children('option:selected').length !== 0)
            $('#action_remove').removeAttr('disabled');
        else
            $('#action_remove').attr('disabled', 'disabled');
    });

    $('#action_remove').click(function(e) {
        var $selectedUsers = $select.children('option:selected');
        var selectedUsers = _.map($selectedUsers, function(user) {
            var value = $(user).val();
            return value === ''? null : value;
        });
        console.log(selectedUsers);
        unblockUsernames(selectedUsers);
        $selectedUsers.remove();
        $('#action_remove').attr('disabled', 'disabled');
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'UNBLOCKUSERS',
                users: selectedUsers,
            });
        });
    });

});
