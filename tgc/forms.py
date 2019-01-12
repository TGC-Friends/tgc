from django import forms
from django.contrib.admin.widgets import AdminDateWidget

class initialForm(forms.Form):
	bridename = forms.CharField(label='Bride Name', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))

	groomname = forms.CharField(label='Groom Name', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))

	phonenum = forms.CharField(label='Phone Number', max_length=12, required = False,
								widget=forms.NumberInput(
									attrs={ 'class': 'm-1',
											'style': 'width:100%; \
											border: 0; \
											border-bottom: 1px solid grey;'}))

	emailfield = forms.EmailField(label='Email Address', required = False, widget=forms.EmailInput(
									attrs={ 'class': 'm-1',
											'style': 'width:100%; \
											border: 0; \
											border-bottom: 1px solid grey;'}))

	howdidyouhear = forms.CharField(label='Lead', max_length=200, required = False,
								widget=forms.TextInput(attrs={ 'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))


	eventdate1 = forms.DateField(label='First Event Date', required = False,
									widget=forms.DateInput(
										attrs={ 'class': 'datetime-input',
												'style': 'height: 2.5em;'}))

	eventtype1 = forms.ChoiceField(label='First Event Type', required = False, 
									choices=[('PWS','PWS'), 
											('Actual', 'Actual'),
											('ROM','ROM')],
								widget=forms.Select(
									attrs={'style':'width:100%; \
													height:2.5em;\
													border: 1px solid #CFD4DA;\
													background-color:white;'})
								)

	eventvenue1 = forms.CharField(label='Event Venue 1', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))




	eventdate2 = forms.DateField(label='Second Event Date', required = False,
									widget=forms.DateInput(
										attrs={ 'class': 'datetime-input'}))

	eventtype2 = forms.ChoiceField(label='Second Event Type', required = False,
									choices=[('PWS','PWS'), 
											('Actual', 'Actual'),
											('ROM','ROM')],
								widget=forms.Select(
									attrs={'style':'width:100%; \
													height:2.5em;\
													border: 1px solid #CFD4DA;\
													background-color:white;'})
								)

	eventvenue2 = forms.CharField(label='Event Venue 1', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))


	requiredoutfit = forms.MultipleChoiceField(label='Second Event Type', required = False,
										choices=[('Bridal Gown','Bridal Gown'), 
												('Evening Gown', 'Evening Gown')],
								widget=forms.CheckboxSelectMultiple(
									attrs={'style':'vertical-align: middle;'})
								)

	noofgowns = forms.IntegerField(label="Number of Gowns", required = False,
									widget=forms.NumberInput(
									attrs={'style':'vertical-align: middle;\
													text-align: center; \
													border: 0; \
													width:100%',
											'class':'align-self-center mt-1 flex-fill'})
									)

	preferredoutfit = forms.MultipleChoiceField(label='Preferred Outfit', required = False,
											choices=[('Mermaid','Mermaid'), 
													('Ball', 'Ball'),
													('A-Line', 'A-Line'),
													('Modified-Line', 'Modified-Line'),
													('Column', 'Column'),
													('Trumpet', 'Trumpet'),
													('No Preference', 'No Preference')
																		],
								widget=forms.CheckboxSelectMultiple(
									attrs={'style':'vertical-align: middle;'})
								)

	preferredoutOthers = forms.CharField(label='Preferred Outfit Others', max_length=300, required = False,
								widget=forms.TextInput(attrs={ 'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))


	preferredstyle = forms.MultipleChoiceField(label='Preferred Style', required = False,
										choices=[('Bead Dress','Bead Dress'), 
												('Lace Dress', 'Lace Dress'),
												('Plain', 'Plain'),
												('No Preference', 'No Preference')
																		],
								widget=forms.CheckboxSelectMultiple(
									attrs={'style':'vertical-align: middle;'})
								)

	preferredstyleOthers = forms.CharField(label='Preferred Style Others', required = False, 
											max_length=300,
								widget=forms.TextInput(attrs={ 'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))


	preferredNeckline = forms.MultipleChoiceField(label='Preferred Neckline', required = False,
											choices=[('Sweetheart','Sweetheart'), 
													('V-Neck', 'V-Neck'),
													('Off-Shoulder', 'Off-Shoulder'),
													('Straight Across', 'Straight Across'),
													('Illusion', 'Illusion'),
													('Bateau_Boat_Neck', 'Bateau'),
																		],
								widget=forms.CheckboxSelectMultiple(
									attrs={'style':'vertical-align: middle;'})
								)
	
	preferredNeckOthers = forms.CharField(label='Preferred Neckline Others', max_length=300, required = False,
								widget=forms.TextInput(attrs={ 'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))


