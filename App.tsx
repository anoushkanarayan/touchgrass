import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [currentPage, setCurrentPage] = useState('signup'); // 'signup', 'sync', 'friends', 'overlaps', 'groups', 'lists'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [friendInputs, setFriendInputs] = useState(['', '', '', '']);
  
  // Groups state
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groups, setGroups] = useState([
    { name: 'dinnerrrr', members: ['Risha', 'Jessica', 'Me'] },
    { name: 'AGM victims', members: ['Mannat', 'Niki', 'Jai', 'Ishaani', 'Me'] },
    { name: 'work friends', members: ['Noah', 'Bhuvi', 'Me'] }
  ]);
  const [selectedDuration, setSelectedDuration] = useState('3 hrs');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState('Mannat');
  const [showFriendDropdown, setShowFriendDropdown] = useState(false);
  const [selectedListTarget, setSelectedListTarget] = useState(null);
  const [listItems, setListItems] = useState({
    'Bhuvi': ['Coffee at Blue Bottle', 'Walk in the park', 'Try new restaurant'],
    'Risha': ['Movie night', 'Shopping', 'Dinner'],
    'Jessica': ['Gym session', 'Lunch', 'Study together'],
    'dinnerrrr': ['Reserve table at Italian place', 'Order wine', 'Split the bill'],
    'AGM victims': ['Plan revenge', 'Order pizza', 'Watch movies'],
    'work friends': ['Team lunch', 'Happy hour', 'Project discussion']
  });
  
  const [nextOverlaps, setNextOverlaps] = useState({
    'Bhuvi': 'tomorrow 4-7 PM',
    'Risha': 'friday 11-1 PM',
    'Jessica': 'saturday 4-7 PM',
    'Niki': 'monday 11-1 PM',
    'Jai': 'tuesday 4-7 PM',
    'Ishaani': 'wednesday 11-1 PM',
    'Noah': 'thursday 4-7 PM',
    'Mannat': 'sunday 11-1 PM',
    'Emma': 'friday 4-7 PM',
    'Alex': 'saturday 11-1 PM',
    'dinnerrrr': 'saturday 4-7 PM',
    'AGM victims': 'friday 11-1 PM',
    'work friends': 'monday 4-7 PM'
  });
  
  // Mock friends database
  const mockFriends = [
    'Bhuvi',
    'Risha', 
    'Jessica',
    'Niki',
    'Jai',
    'Ishaani',
    'Noah',
    'Mannat',
    'Emma',
    'Alex'
  ];
  
  // Use the same mock friends for consistency
  const placeholderContacts = mockFriends;
  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleSignUp = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    
    // TODO: Implement actual phone number sign up logic
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage('sync'); // Navigate to sync calendar page
    }, 1500);
  };

  const handleConnectGoogleCalendar = () => {
    // TODO: Implement Google Calendar connection logic
    Alert.alert('Success', 'Google Calendar connected successfully!');
  };

  const handleConnectAppleCalendar = () => {
    // TODO: Implement Apple Calendar connection logic
    Alert.alert('Success', 'Apple Calendar connected successfully!');
    setCurrentPage('friends'); // Navigate to add friends page
  };

  const handleAddFriend = (index: number) => {
    const friendName = friendInputs[index].trim();
    if (!friendName) {
      Alert.alert('Error', 'Please enter a friend\'s name');
      return;
    }

    if (friends.length >= 10) {
      Alert.alert('Error', 'You can only add up to 10 friends');
      return;
    }

    if (friends.includes(friendName)) {
      Alert.alert('Error', 'This friend is already added');
      return;
    }

    setFriends([...friends, friendName]);
    const newInputs = [...friendInputs];
    newInputs[index] = '';
    setFriendInputs(newInputs);
  };

  const handleAddContactFriend = (contactName: string) => {
    if (friends.includes(contactName)) {
      // Remove friend if already added
      setFriends(friends.filter(friend => friend !== contactName));
    } else {
      // Add friend if not already added
      if (friends.length >= 10) {
        Alert.alert('Error', 'You can only add up to 10 friends');
        return;
      }
      setFriends([...friends, contactName]);
    }
  };

  const handleFriendInputChange = (index: number, text: string) => {
    const newInputs = [...friendInputs];
    newInputs[index] = text;
    setFriendInputs(newInputs);
  };

  const handleContinue = () => {
    if (friends.length === 0) {
      Alert.alert('Skip', 'You can add friends later in the app');
    }
    setCurrentPage('overlaps');
  };

  // Group management functions
  const handleCreateGroup = () => {
    if (newGroupName.trim() === '') {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    if (selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select at least one friend');
      return;
    }
    
    const newGroup = {
      name: newGroupName.trim(),
      members: [...selectedFriends, 'Me']
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setSelectedFriends([]);
    setShowCreateGroupModal(false);
  };

  const handleToggleFriend = (friendName: string) => {
    if (selectedFriends.includes(friendName)) {
      setSelectedFriends(selectedFriends.filter(f => f !== friendName));
    } else {
      setSelectedFriends([...selectedFriends, friendName]);
    }
  };

  const handleAddListItem = (target: string, newItem: string) => {
    if (newItem.trim() === '') return;
    setListItems(prev => ({
      ...prev,
      [target]: [...(prev[target] || []), newItem.trim()]
    }));
  };

  const handleRemoveListItem = (target: string, index: number) => {
    setListItems(prev => ({
      ...prev,
      [target]: prev[target].filter((_, i) => i !== index)
    }));
  };

  const renderSignUpPage = () => (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>touchgrass</Text>
        <Text style={styles.subtitle}>make it out of the group chat</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="(555) 123-4567"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={14}
          />
        </View>

        <TouchableOpacity
          style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signUpButtonText}>
            {isLoading ? 'creating account...' : 'sign up'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          by signing up, you agree to our terms of service and privacy policy
        </Text>
      </View>
    </View>
  );

  const renderSyncCalendarPage = () => (
    <View style={styles.content}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.calendarIcon}>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <View style={styles.calendarHeaderText} />
          </View>
          
          {/* Calendar Body */}
          <View style={styles.calendarBody}>
            {/* Week days row */}
            <View style={styles.weekDaysRow}>
              <View style={styles.weekDay} />
              <View style={styles.weekDay} />
              <View style={styles.weekDay} />
              <View style={styles.weekDay} />
              <View style={styles.weekDay} />
              <View style={styles.weekDay} />
              <View style={styles.weekDay} />
            </View>
            
            {/* Calendar dates */}
            <View style={styles.calendarDates}>
              <View style={styles.dateRow}>
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
              </View>
              <View style={styles.dateRow}>
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
              </View>
              <View style={styles.dateRow}>
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
              </View>
              <View style={styles.dateRow}>
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
              </View>
              <View style={styles.dateRow}>
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
                <View style={styles.dateCell} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.syncTitle}>sync your calendar</Text>
        <Text style={styles.syncSubtitle}>we only see if you're busy or free</Text>
      </View>

      {/* Buttons */}
      <View style={styles.syncButtons}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleConnectGoogleCalendar}
        >
          <View style={styles.buttonContent}>
            <View style={styles.googleLogo}>
              <Text style={styles.googleLogoText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>connect google calendar</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.appleButton}
          onPress={handleConnectAppleCalendar}
        >
          <View style={styles.buttonContent}>
            <View style={styles.appleLogo}>
              <Text style={styles.appleLogoText}>🍎</Text>
            </View>
            <Text style={styles.appleButtonText}>connect apple calendar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Main App Screens
  const renderOverlapsPage = () => {
    // Get minimum duration in hours
    const getMinDuration = () => {
      switch (selectedDuration) {
        case '1 hr': return 1;
        case '2 hrs': return 2;
        case '3 hrs': return 3;
        default: return 3;
      }
    };

    const minDuration = getMinDuration();

    // Generate time slots from 8 AM to 12 AM (midnight) - hours only
    const timeSlots = [];
    for (let hour = 8; hour <= 23; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const timeLabel = `${displayHour}:00 ${ampm}`;
      
      timeSlots.push(
        <View key={`${hour}-00`} style={styles.timeSlot}>
          <View style={styles.timeLabel}>
            <Text style={styles.timeText}>{timeLabel}</Text>
          </View>
          <View style={styles.timeLine} />
          <View style={styles.timeContent}>
            {/* Sample overlap blocks - only show if they meet minimum duration */}
            {hour === 9 && minDuration <= 1 && (
              <View style={[styles.overlapBlock, { top: 0, height: 60 }]}>
                <Text style={styles.overlapText}>9-10 AM</Text>
              </View>
            )}
            {hour === 11 && minDuration <= 2 && (
              <View style={[styles.overlapBlock, { top: 0, height: 120 }]}>
                <Text style={styles.overlapText}>11-1 PM</Text>
              </View>
            )}
            {hour === 16 && minDuration <= 3 && (
              <View style={[styles.overlapBlock, { top: 0, height: 180 }]}>
                <Text style={styles.overlapText}>4-7 PM</Text>
              </View>
            )}
          </View>
        </View>
      );
    }
    
    // Add midnight
    timeSlots.push(
      <View key="24-00" style={styles.timeSlot}>
        <View style={styles.timeLabel}>
          <Text style={styles.timeText}>12:00 AM</Text>
        </View>
        <View style={styles.timeLine} />
        <View style={styles.timeContent}>
          {/* Green overlap blocks will go here */}
        </View>
      </View>
    );

  return (
      <View style={styles.mainContent}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>overlaps</Text>
        </View>
        
        {/* Dropdowns Row */}
        <View style={styles.dropdownsRow}>
          {/* Friend/Group Selector */}
          <View style={styles.friendSelectorContainer}>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setShowFriendDropdown(!showFriendDropdown)}
            >
              <Text style={styles.selectorText}>{selectedFriend}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            
            {showFriendDropdown && (
              <View style={styles.dropdownOptions}>
                <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
                  {mockFriends.map((friend) => (
                    <TouchableOpacity 
                      key={friend}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setSelectedFriend(friend);
                        setShowFriendDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{friend}</Text>
                    </TouchableOpacity>
                  ))}
                  {groups.map((group) => (
                    <TouchableOpacity 
                      key={group.name}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setSelectedFriend(group.name);
                        setShowFriendDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{group.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Duration Selector */}
          <View style={styles.timeSelectorContainer}>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setShowDurationDropdown(!showDurationDropdown)}
            >
              <Text style={styles.selectorText}>{selectedDuration}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            
            {showDurationDropdown && (
              <View style={styles.dropdownOptions}>
                <TouchableOpacity 
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedDuration('1 hr');
                    setShowDurationDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>1 hr</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedDuration('2 hrs');
                    setShowDurationDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>2 hrs</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedDuration('3 hrs');
                    setShowDurationDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>3 hrs</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        {/* Date Navigation Header */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateTitle}>today</Text>
        </View>
        
        <ScrollView style={styles.scheduleContainer} showsVerticalScrollIndicator={false}>
          {timeSlots}
        </ScrollView>
      </View>
    );
  };

  const renderGroupsPage = () => (
    <View style={styles.mainContent}>
      <View style={[styles.mainHeader, showCreateGroupModal && styles.mainHeaderDimmed]}>
        <Text style={[styles.mainTitle, showCreateGroupModal && styles.mainTitleDimmed]}>groups</Text>
        <TouchableOpacity 
          style={[styles.addButton, showCreateGroupModal && styles.addButtonDimmed]}
          onPress={() => setShowCreateGroupModal(true)}
        >
          <Text style={[styles.addButtonText, showCreateGroupModal && styles.addButtonTextDimmed]}>+</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.groupsList}>
        {groups.map((group, index) => (
          <View key={index} style={styles.groupBox}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>{group.members.join(', ')}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderListsPage = () => {
    // If a specific friend/group is selected, show their list page
    if (selectedListTarget) {
      return (
        <View style={styles.mainContent}>
          <View style={styles.mainHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedListTarget(null)}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.mainTitle}>{selectedListTarget}</Text>
          </View>
          
          <ScrollView style={styles.listsContainer}>
            {/* Overlap Card */}
            <View style={styles.overlapCard}>
              <Text style={styles.overlapTime}>Tomorrow 4:30-6:30</Text>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
            
            {/* Editable Checklist */}
            <View style={styles.checklist}>
              <Text style={styles.checklistTitle}>Things to do together:</Text>
              {listItems[selectedListTarget]?.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                  <View style={styles.checkbox}></View>
                  <Text style={styles.checklistText}>{item}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveListItem(selectedListTarget, index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Add new item */}
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  placeholder="Add new item..."
                  onSubmitEditing={(e) => {
                    handleAddListItem(selectedListTarget, e.nativeEvent.text);
                    e.currentTarget.clear();
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    // Main lists page with group and friend boxes
    return (
      <View style={styles.mainContent}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>lists</Text>
        </View>
        
        <ScrollView style={styles.listsContainer}>
          {/* Group Boxes */}
          {groups.map((group, index) => (
            <TouchableOpacity 
              key={`group-${index}`}
              style={styles.listBox}
              onPress={() => setSelectedListTarget(group.name)}
            >
              <Text style={styles.listBoxName}>{group.name}</Text>
              <Text style={styles.listBoxSubtitle}>next overlap: {nextOverlaps[group.name]}</Text>
            </TouchableOpacity>
          ))}
          
          {/* Friend Boxes */}
          {mockFriends.map((friend, index) => (
            <TouchableOpacity 
              key={`friend-${index}`}
              style={styles.listBox}
              onPress={() => setSelectedListTarget(friend)}
            >
              <Text style={styles.listBoxName}>{friend}</Text>
              <Text style={styles.listBoxSubtitle}>next overlap: {nextOverlaps[friend]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.navItem, currentPage === 'overlaps' && !showCreateGroupModal && styles.navItemActive]}
        onPress={() => setCurrentPage('overlaps')}
      >
        <Text style={styles.navIcon}>🕐</Text>
        <Text style={styles.navLabel}>overlaps</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentPage === 'groups' && !showCreateGroupModal && styles.navItemActive]}
        onPress={() => setCurrentPage('groups')}
      >
        <Text style={styles.navIcon}>👥</Text>
        <Text style={styles.navLabel}>groups</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentPage === 'lists' && !showCreateGroupModal && styles.navItemActive]}
        onPress={() => setCurrentPage('lists')}
      >
        <Text style={styles.navIcon}>📝</Text>
        <Text style={styles.navLabel}>lists</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddFriendsPage = () => (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.friendsTitle}>add close friends</Text>
        <Text style={styles.friendsSubtitle}>people you actually wanna see</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Contact List Section */}
        <View style={styles.contactsSection}>
          {placeholderContacts.map((contact, index) => (
            <View key={index} style={styles.contactRow}>
              <View style={styles.contactCircle}>
                <Text style={styles.contactInitial}>
                  {contact.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <Text style={styles.contactName}>{contact}</Text>
              <TouchableOpacity
                style={[
                  styles.addContactButton,
                  friends.includes(contact) && styles.addContactButtonAdded
                ]}
                onPress={() => handleAddContactFriend(contact)}
              >
                <Text style={[
                  styles.addContactButtonText,
                  friends.includes(contact) && styles.addContactButtonTextAdded
                ]}>
                  {friends.includes(contact) ? 'added' : 'add'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Continue Button */}
      <View style={styles.friendsFooter}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {friends.length > 0 ? `continue (${friends.length} friends)` : 'continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMainApp = () => (
    <View style={styles.mainAppContainer}>
      {currentPage === 'overlaps' && renderOverlapsPage()}
      {currentPage === 'groups' && renderGroupsPage()}
      {currentPage === 'lists' && renderListsPage()}
      {renderBottomNav()}
      
      {/* Create Group Modal - rendered at main app level */}
      {showCreateGroupModal && (
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardView}
          >
            <View style={styles.modalContent}>
              <TextInput
                style={styles.groupNameInput}
                placeholder="group name"
                value={newGroupName}
                onChangeText={setNewGroupName}
                autoCapitalize="none"
                autoFocus={true}
              />

              <Text style={styles.inputLabel}>invite to group</Text>
              <ScrollView style={styles.friendsSelector} showsVerticalScrollIndicator={false}>
                {mockFriends.map((friend) => (
                  <TouchableOpacity
                    key={friend}
                    style={[
                      styles.friendOption,
                      selectedFriends.includes(friend) && styles.friendOptionSelected
                    ]}
                    onPress={() => handleToggleFriend(friend)}
                  >
                    <Text style={[
                      styles.friendOptionText,
                      selectedFriends.includes(friend) && styles.friendOptionTextSelected
                    ]}>
                      {friend}
                    </Text>
                    {selectedFriends.includes(friend) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowCreateGroupModal(false);
                    setNewGroupName('');
                    setSelectedFriends([]);
                  }}
                >
                  <Text style={styles.cancelButtonText}>cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateGroup}
                >
                  <Text style={styles.createButtonText}>create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {currentPage === 'signup' || currentPage === 'sync' || currentPage === 'friends' ? (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {currentPage === 'signup' ? renderSignUpPage() : 
           currentPage === 'sync' ? renderSyncCalendarPage() : 
           renderAddFriendsPage()}
        </KeyboardAvoidingView>
      ) : (
        renderMainApp()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5', // Baby pink background
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: -1,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '300',
  },
  form: {
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    borderWidth: 2,
    borderColor: '#FFB3BA', // Light pink border
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '400',
  },
  signUpButton: {
    backgroundColor: '#FF8A80', // Coral/orange button
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF8A80',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButtonDisabled: {
    backgroundColor: '#FFB3BA',
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '300',
  },
  // Sync Calendar Page Styles
  iconContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  calendarIcon: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D0D0D0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  calendarHeader: {
    height: 20,
    backgroundColor: '#FF8A80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarHeaderText: {
    width: 12,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  calendarBody: {
    flex: 1,
    padding: 3,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    paddingHorizontal: 1,
  },
  weekDay: {
    width: 7,
    height: 2,
    backgroundColor: '#CCCCCC',
    borderRadius: 1,
  },
  calendarDates: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    paddingHorizontal: 1,
  },
  dateCell: {
    width: 7,
    height: 7,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
  },
  syncTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  syncSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '300',
  },
  syncButtons: {
    marginTop: 48,
  },
  googleButton: {
    backgroundColor: '#FF8A80', // Coral/orange button
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#FF8A80',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  appleButton: {
    backgroundColor: '#FF8A80', // Coral/orange button
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#FF8A80',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  appleLogo: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appleLogoText: {
    fontSize: 16,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  // Add Friends Page Styles
  friendsTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  friendsSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '300',
  },
  friendsList: {
    marginTop: 32,
    marginBottom: 32,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  friendCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#D0D0D0',
    marginRight: 16,
  },
  friendInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#FFB3BA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#FF8A80',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  friendsFooter: {
    alignItems: 'center',
    paddingTop: 40,
  },
  continueButton: {
    backgroundColor: '#FF8A80',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    shadowColor: '#FF8A80',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Scrollable Content Styles
  scrollableContent: {
    flex: 0.6,
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contactsSection: {
    marginTop: 24,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  contactCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8A80',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInitial: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactName: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  addContactButton: {
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: '#FF8A80',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addContactButtonAdded: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0.1,
  },
  addContactButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  addContactButtonTextAdded: {
    color: '#999999',
  },
  
  // Main App Styles
  mainAppContainer: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  mainTitleDimmed: {
    color: '#999',
  },
  mainHeaderDimmed: {
    opacity: 0.6,
  },
  addButtonDimmed: {
    opacity: 0.6,
  },
  addButtonTextDimmed: {
    opacity: 0.6,
  },
  
  // Overlaps Screen Styles
  dropdownsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 20,
  },
  selectorContainer: {
    position: 'relative',
  },
  friendSelectorContainer: {
    position: 'relative',
    flex: 1,
  },
  timeSelectorContainer: {
    position: 'relative',
    width: 120,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FFB3BA',
    minWidth: 100,
  },
  selectorText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownOptions: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB3BA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownScrollView: {
    maxHeight: 180,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  dateHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  scheduleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeSlot: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  timeLabel: {
    width: 80,
    paddingRight: 12,
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  timeLine: {
    width: 1,
    height: 60,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  timeContent: {
    flex: 1,
    height: 60,
    position: 'relative',
  },
  overlapBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlapText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Groups Screen Styles
  groupsList: {
    flex: 1,
  },
  groupBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFB3BA',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  groupMembers: {
    fontSize: 14,
    color: '#666',
  },
  
  // Lists Screen Styles
  listsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FF8A80',
    fontWeight: '300',
  },
  listBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listBoxName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  listBoxSubtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  overlapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overlapTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  checklist: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FF8A80',
    marginRight: 12,
  },
  checklistText: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF8A80',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addItemContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addItemInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  
  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 138, 128, 0.1)',
    borderRadius: 8,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '400',
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalKeyboardView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#FFB3BA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'left',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  groupNameInput: {
    borderWidth: 1,
    borderColor: '#FFB3BA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFF5F5',
    marginBottom: 8,
  },
  friendsSelector: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#FFB3BA',
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
  },
  friendOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFB3BA',
  },
  friendOptionSelected: {
    backgroundColor: '#FF8A80',
  },
  friendOptionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  friendOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});