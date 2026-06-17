$(function(){
	"use strict";

	/*=========================================================================
		Initializing stellar.js Plugin
	=========================================================================*/
	$('.section').stellar({
		horizontalScrolling: false
	});
	
	
	$(window).on('load', function(){
		setTimeout(function(){
			$('body').addClass('loaded');
		}, 800);
	
		
		/*=========================================================================
			Portfolio Grid
		=========================================================================*/
		var grid = $('#portfolio-grid');
		grid.shuffle({
			itemSelector: '.item'
		});
		
		$('#portfolio-filters > ul > li > a').on('click', function (e) {
			e.preventDefault();
			var groupName = $(this).attr('data-group');
			$('#portfolio-filters > ul > li > a').removeClass('active');
			$(this).addClass('active');
			grid.shuffle('shuffle', groupName );
		});
		
		$('a.image-link').magnificPopup({
			type: 'image',
			removalDelay: 300,
			mainClass: 'mfp-fade',
			gallery: {
				enabled: true
			}
		});
	
	});
	
	
	
	/*=========================================================================
		Links Navigation System
	=========================================================================*/
	$('.front-person-links > ul > li > a[data-section]').on('click', function(e){
		e.preventDefault();
		var section = $('#' + $(this).data('section'));
		
		if( section.size() != 0 ){
			
			$('body').addClass('section-show');
			
			section.addClass('active');
		
		}
		
	});
	$('.close-btn').on('click', function(){
		$('body').removeClass('section-show');
		$('section.active').removeClass('active');
	});
	
	
	
	/*=========================================================================
		Testimonials Slider
	=========================================================================*/
	$('.testimonials-slider').owlCarousel({
		singleItem: true
	});
	
	
	
	/*=========================================================================
		Skill Bar's Percent Initialization from attribute data-percent
	=========================================================================*/
	$('.skill-bar').each(function(){
		var $this = $(this),
			percent = parseInt( $this.data('percent'), 10 );
		
		$this.find('.bar').css('width', percent + '%');
	});
	
	
	
	
	/*=========================================================================
		Contact Form
	=========================================================================*/
	function isJSON(val){
		var str = val.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
		return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
	}
	$('#contact-form').validator().on('submit', function (e) {
		
		if (!e.isDefaultPrevented()) {
			// If there is no any error in validation then send the message
			
			e.preventDefault();
			var $this = $(this),
				
				//You can edit alerts here
				alerts = {
				
					success: 
					"<div class='form-group' >\
						<div class='alert alert-success alert-dismissible' role='alert'> \
							<button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
								<i class='ion-ios-close-empty' ></i> \
							</button> \
							<strong>Message Sent!</strong> We'll be in touch as soon as possible\
						</div>\
					</div>",
					
					
					error: 
					"<div class='form-group' >\
						<div class='alert alert-danger alert-dismissible' role='alert'> \
							<button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
								<i class='ion-ios-close-empty' ></i> \
							</button> \
							<strong>Error!</strong> Sorry, an error occurred. Try again.\
						</div>\
					</div>"
					
				};
			
			$.ajax({
			
				url: 'mail.php',
				type: 'post',
				data: $this.serialize(),
				success: function(data){
					
					if( isJSON(data) ){
						
						data = $.parseJSON(data);
						
						if(data['error'] == false){
							
							$('#contact-form-result').html(alerts.success);
							
							$('#contact-form').trigger('reset');
							
						}else{
							
							$('#contact-form-result').html(
							"<div class='form-group' >\
								<div class='alert alert-danger alert-dismissible' role='alert'> \
									<button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
										<i class='ion-ios-close-empty' ></i> \
									</button> \
									"+ data['error'] +"\
								</div>\
							</div>"
							);
							
						}
						
						
					}else{
						$('#contact-form-result').html(alerts.error);
					}
					
				},
				error: function(){
					$('#contact-form-result').html(alerts.error);
				}
			});
		}
	});

	/*=========================================================================
		Google Analytics 4 Private Event Tracking
	=========================================================================*/
	function trackEvent(name, params) {
		if (typeof gtag === "function") {
			gtag("event", name, params);
		}
	}

	// 1. Page Load Tracking (case_study_view & recommendations_view)
	var pathname = window.location.pathname;
	var pageName = pathname.substring(pathname.lastIndexOf('/') + 1) || 'index.html';

	var caseStudies = {
		'healthcare-reporting-case-study': 'Healthcare Reporting',
		'healthcare-validation-workbook': 'Healthcare Validation Workbook',
		'healthcare-reporting-dashboard': 'Healthcare Reporting Dashboard',
		'healthcare-executive-package': 'Healthcare Executive Package',
		'truebalance-planner-case-study': 'TrueBalance Planner',
		'cold-day-case-study': 'Project Continuum',
		'ai-automation-case-study': 'AI & Automation'
	};

	if (pageName.indexOf('linkedin-recommendations') !== -1) {
		trackEvent('recommendations_view', {
			page_location: window.location.href
		});
	} else {
		for (var key in caseStudies) {
			if (pageName.indexOf(key) !== -1) {
				trackEvent('case_study_view', {
					case_study_name: caseStudies[key],
					page_location: window.location.href
				});
				break;
			}
		}
	}

	// 2. Resume Downloads Tracking
	$(document).on('click', 'a[href$=".pdf"], a[download]', function() {
		var href = $(this).attr('href') || '';
		var fileName = href.substring(href.lastIndexOf('/') + 1);
		var resumeType = 'General';
		
		if (fileName.indexOf('Business_Analyst') !== -1) {
			resumeType = 'Business Analyst';
		} else if (fileName.indexOf('Data_Reporting') !== -1) {
			resumeType = 'Data Reporting';
		} else if (fileName.indexOf('QA_Test') !== -1) {
			resumeType = 'QA';
		} else if (fileName.indexOf('Jan29') !== -1 || fileName.indexOf('Resume_2026') !== -1) {
			resumeType = 'General';
		}
		
		trackEvent('resume_download', {
			resume_type: resumeType,
			file_name: fileName,
			page_location: window.location.href
		});
	});

	// 3. Recommendation Page Click Tracking (from Home or other links)
	$(document).on('click', 'a[href*="linkedin-recommendations"]', function() {
		trackEvent('recommendations_view', {
			page_location: window.location.href
		});
	});

	// 4. Portfolio Case Study Click Tracking (from portfolio cards)
	$(document).on('click', '#portfolio-grid a', function() {
		var href = $(this).attr('href') || '';
		var caseStudyName = '';
		
		if (href.indexOf('healthcare-reporting-case-study') !== -1) {
			caseStudyName = 'Healthcare Reporting';
		} else if (href.indexOf('truebalance-planner-case-study') !== -1) {
			caseStudyName = 'TrueBalance Planner';
		} else if (href.indexOf('cold-day-case-study') !== -1) {
			caseStudyName = 'Project Continuum';
		} else if (href.indexOf('ai-automation-case-study') !== -1) {
			caseStudyName = 'AI & Automation';
		}
		
		if (caseStudyName) {
			trackEvent('portfolio_case_study_click', {
				case_study_name: caseStudyName,
				destination_url: href
			});
		}
	});

	// 5. External LinkedIn Clicks (unified profile clicks and recommendation card profile clicks)
	$(document).on('click', 'a[href*="linkedin.com"]', function() {
		var href = $(this).attr('href') || '';
		var name = '';
		
		var recCard = $(this).closest('.recommendation-card-wrapper');
		if (recCard.length) {
			name = recCard.find('h4').text().trim();
		} else if (href.indexOf('/in/thisha') !== -1) {
			name = 'Thisha Smith';
		} else {
			name = $(this).text().trim() || $(this).closest('h4').text().trim() || '';
			name = name.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
		}
		
		trackEvent('external_linkedin_click', {
			profile_name: name,
			profile_url: href
		});
	});

	// 6. GitHub Click Tracking
	$(document).on('click', 'a[href*="github.com"]', function() {
		var href = $(this).attr('href') || '';
		trackEvent('github_click', {
			profile_url: href
		});
	});

	// 7. TrueBalance Live App Link Tracking (external product link)
	$(document).on('click', 'a[href*="app-truebalance.netlify.app"]', function() {
		var href = $(this).attr('href') || '';
		trackEvent('external_product_link', {
			product_name: 'TrueBalance Planner',
			product_url: href
		});
	});

	// 8. Portfolio Interactions Tracking (filter clicks)
	$(document).on('click', '#portfolio-filters > ul > li > a', function() {
		var group = $(this).attr('data-group') || 'all';
		var filterText = $(this).text().trim();
		trackEvent('portfolio_interaction', {
			interaction_type: 'filter',
			filter_group: group,
			filter_name: filterText
		});
	});

	// 9. Back to Top Scroll Behavior and Click Event
	$(window).on('scroll', function() {
		if ($(window).scrollTop() > 300) {
			$('#back-to-top').addClass('show');
		} else {
			$('#back-to-top').removeClass('show');
		}
	});

	$('section').on('scroll', function() {
		// Only allow the back-to-top button on the Resume section of index.html
		var isResumeSection = $(this).attr('id') === 'resume';
		if (isResumeSection && $(this).scrollTop() > 300) {
			$('#back-to-top').addClass('show');
		} else {
			$('#back-to-top').removeClass('show');
		}
	});

	// Hide back-to-top button immediately upon closing a section or transitioning between sections
	$(document).on('click', '.close-btn, .nav-link-home, .nav-link-section, .front-person-links a', function() {
		$('#back-to-top').removeClass('show');
	});

	$(document).on('click', '#back-to-top', function(e) {
		e.preventDefault();
		var $activeSection = $('section.active');
		if ($activeSection.length) {
			$activeSection.animate({ scrollTop: 0 }, 600);
		} else {
			$('html, body').animate({ scrollTop: 0 }, 600);
		}
		trackEvent('back_to_top_click', {
			page_location: window.location.href
		});
	});
	
});