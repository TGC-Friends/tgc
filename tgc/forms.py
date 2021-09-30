from django import forms
from django.contrib.admin.widgets import AdminDateWidget

class initialForm(forms.Form):
	bridename = forms.CharField(label='Bride Name', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'id':'bridename',
																'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))

	groomname = forms.CharField(label='Groom Name', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'id':'groomname',
																'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))

	phonenum = forms.CharField(label='Phone Number', max_length=12, required = False,
								widget=forms.NumberInput(
									attrs={ 'id':'phonenum',
											'class': 'm-1',
											'style': 'width:100%; \
											border: 0; \
											border-bottom: 1px solid grey;'}))

	emailfield = forms.EmailField(label='Email Address', required = False, widget=forms.EmailInput(
									attrs={ 'id':'emailfield',
											'class': 'm-1',
											'style': 'width:100%; \
											border: 0; \
											border-bottom: 1px solid grey;'}))

	howdidyouhear = forms.CharField(label='Lead', max_length=200, required = False,
								widget=forms.TextInput(attrs={ 'id':'howdidyouhear',
																'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))


	eventdate1 = forms.DateField(label='First Event Date', required = False,
									widget=forms.DateInput(
										attrs={ 'id':'eventdate1',
												'class': 'datetime-input',
												'style': 'height: 2.5em;'}))

	eventtype1 = forms.ChoiceField(label='First Event Type', required = False, 
									choices=[('None','None'),
											('PWS','PWS'), 
											('Actual', 'Actual'),
											('ROM','ROM')],
								widget=forms.Select(
									attrs={'id':'eventtype1',
											'style':'width:100%; \
													height:2.5em;\
													border: 1px solid #CFD4DA;\
													background-color:white;'})
								)

	eventvenue1 = forms.CharField(label='Event Venue 1', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'id':'eventvenue1',
																'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))




	eventdate2 = forms.DateField(label='Second Event Date', required = False,
									widget=forms.DateInput(
										attrs={ 'id':'eventdate2',
												'class': 'datetime-input'}))

	eventtype2 = forms.ChoiceField(label='Second Event Type', required = False,
									choices=[('None','None'),
											('PWS','PWS'), 
											('Actual', 'Actual'),
											('ROM','ROM')],
								widget=forms.Select(
									attrs={'id':'eventtype2',
											'style':'width:100%; \
													height:2.5em;\
													border: 1px solid #CFD4DA;\
													background-color:white;'})
								)

	eventvenue2 = forms.CharField(label='Event Venue 2', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'id':'eventvenue2',
																'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))

	eventdate3 = forms.DateField(label='Third Event Date', required = False,
									widget=forms.DateInput(
										attrs={ 'id':'eventdate3',
												'class': 'datetime-input'}))

	eventtype3 = forms.ChoiceField(label='Third Event Type', required = False,
									choices=[('None','None'),
											('PWS','PWS'), 
											('Actual', 'Actual'),
											('ROM','ROM')],
								widget=forms.Select(
									attrs={'id':'eventtype3',
											'style':'width:100%; \
													height:2.5em;\
													border: 1px solid #CFD4DA;\
													background-color:white;'})
								)

	eventvenue3 = forms.CharField(label='Event Venue 3', max_length=100, required = False,
								widget=forms.TextInput(attrs={ 'id':'eventvenue3',
																'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))


	requiredoutfit = forms.MultipleChoiceField(label='Second Event Type', required = False,
										choices=[('Bridal Gown','Bridal Gown'), 
												('Evening Gown', 'Evening Gown')],
								widget=forms.CheckboxSelectMultiple(
									attrs={'id':'requiredoutfit',
											'style':'vertical-align: middle;'})
								)

	noofgowns = forms.IntegerField(label="Number of Gowns", required = False,
									widget=forms.NumberInput(
									attrs={'id':'noofgowns',
											'style':'vertical-align: middle;\
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
									attrs={'id':'preferredoutfit',
											'style':'vertical-align: middle;'})
								)

	preferredoutOthers = forms.CharField(label='Preferred Outfit Others', max_length=300, required = False,
								widget=forms.TextInput(attrs={ 'id':'preferredoutOthers',
																'class': 'm-1',
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
									attrs={'id':'preferredstyle',
											'style':'vertical-align: middle;'})
								)

	preferredstyleOthers = forms.CharField(label='Preferred Style Others', required = False, 
											max_length=300,
								widget=forms.TextInput(attrs={ 'id':'preferredstyleOthers',
																'class': 'm-1',
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
									attrs={'id':'preferredNeckline',
											'style':'vertical-align: middle;'})
								)
	
	preferredNeckOthers = forms.CharField(label='Preferred Neckline Others', max_length=300, required = False,
								widget=forms.TextInput(attrs={ 'id':'preferredNeckOthers',
																'class': 'm-1',
																'style': 'width:100%; \
																border: 0; \
																border-bottom: 1px solid grey;'}))

	attendant = forms.ChoiceField(label='Attendant',
									choices=[ 
											('Kelly','Kelly'),
											#('Natalie','Natalie'),
											('Shermin','Shermin'),
											('Jenn','Jenn'),
											#('Cheryl', 'Cheryl'),
											('Vivien', 'Vivien'),
											('Michelle', 'Michelle'),
											],
								widget=forms.Select(
									attrs={'id':'attendant',})
								)

	additionalnotes = forms.CharField(label='Additional Notes', required = False,
								widget=forms.Textarea(attrs={ 'id':'additionalnotes',
																'class': 'm-2',
																'style':"width: 98%;",
																'cols':20,}))


