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
		var absoluteUrl = $(this).prop('href') || href;
		var fileName = href.substring(href.lastIndexOf('/') + 1);
		var resumeType = 'General';
		var resumeVariant = 'general';
		
		if (fileName.indexOf('Business_Analyst') !== -1) {
			resumeType = 'Business Analyst';
			resumeVariant = 'business_analyst';
		} else if (fileName.indexOf('Data_Reporting') !== -1) {
			resumeType = 'Data Reporting';
			resumeVariant = 'data_reporting';
		} else if (fileName.indexOf('QA_Test') !== -1) {
			resumeType = 'QA';
			resumeVariant = 'qa';
		} else if (fileName.indexOf('Jan29') !== -1 || fileName.indexOf('Resume_2026') !== -1) {
			resumeType = 'General';
			resumeVariant = 'general';
		}
		
		trackEvent('resume_download', {
			resume_type: resumeType,
			resume_variant: resumeVariant,
			file_name: fileName,
			page_location: window.location.href,
			link_url: absoluteUrl
		});
	});

	// 3. Recommendation Page Click Tracking (from Home or other links)
	$(document).on('click', 'a[href*="linkedin-recommendations"]', function() {
		var href = $(this).attr('href') || '';
		var absoluteUrl = $(this).prop('href') || href;
		var text = $(this).text().trim() || 'Recommendations';
		
		trackEvent('recommendations_click', {
			link_text: text,
			page_location: window.location.href,
			link_url: absoluteUrl
		});
		
		// Legacy trackEvent:
		trackEvent('recommendations_view', {
			page_location: window.location.href
		});
	});

	// 4. Portfolio Case Study Click Tracking (from portfolio cards or case study links)
	$(document).on('click', '#portfolio-grid a, a[href*="case-study.html"]', function() {
		var href = $(this).attr('href') || '';
		var absoluteUrl = $(this).prop('href') || href;
		var text = $(this).text().trim() || 'Case Study';
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
		
		trackEvent('portfolio_case_study_click', {
			case_study_name: caseStudyName,
			link_text: text,
			page_location: window.location.href,
			link_url: absoluteUrl
		});
	});

	// 5. External LinkedIn Clicks (unified profile clicks and recommendation card profile clicks)
	$(document).on('click', 'a[href*="linkedin.com"]', function() {
		var href = $(this).attr('href') || '';
		var absoluteUrl = $(this).prop('href') || href;
		var text = $(this).text().trim() || 'LinkedIn';
		var name = '';
		
		var recCard = $(this).closest('.recommendation-card-wrapper');
		if (recCard.length) {
			name = recCard.find('h4').text().trim();
		} else if (href.indexOf('/in/thisha') !== -1) {
			name = 'Thisha Smith';
		} else {
			name = text || $(this).closest('h4').text().trim() || '';
			name = name.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
		}
		
		trackEvent('external_linkedin_click', {
			profile_name: name,
			profile_url: absoluteUrl
		});

		trackEvent('linkedin_click', {
			link_text: text,
			page_location: window.location.href,
			link_url: absoluteUrl
		});
	});

	// 6. GitHub Click Tracking & Exit
	$(document).on('click', 'a[href*="github.com"]', function() {
		var href = $(this).attr('href') || '';
		var absoluteUrl = $(this).prop('href') || href;
		var text = $(this).text().trim() || 'GitHub';
		
		trackEvent('github_click', {
			link_text: text,
			page_location: window.location.href,
			link_url: absoluteUrl
		});

		trackEvent('external_portfolio_exit', {
			destination_name: 'GitHub',
			link_url: absoluteUrl,
			page_location: window.location.href,
			link_text: text
		});
	});

	// 6a. Email Link Tracking
	$(document).on('click', 'a[href^="mailto:"]', function() {
		var href = $(this).attr('href') || '';
		var text = $(this).text().trim() || 'Email';
		
		trackEvent('email_click', {
			link_text: text,
			page_location: window.location.href,
			link_url: href
		});
	});

	// 6b. Phone Link Tracking
	$(document).on('click', 'a[href^="tel:"]', function() {
		var href = $(this).attr('href') || '';
		var text = $(this).text().trim() || 'Phone';
		
		trackEvent('phone_click', {
			link_text: text,
			page_location: window.location.href,
			link_url: href
		});
	});

	// 7. TrueBalance Live App Link Tracking & Exit (external product link)
	$(document).on('click', 'a[href*="app-truebalance.netlify.app"]', function() {
		var href = $(this).attr('href') || '';
		var absoluteUrl = $(this).prop('href') || href;
		var text = $(this).text().trim() || 'TrueBalance Live App';
		
		trackEvent('external_product_link', {
			product_name: 'TrueBalance Planner',
			product_url: absoluteUrl
		});

		trackEvent('external_portfolio_exit', {
			destination_name: 'TrueBalance Planner',
			link_url: absoluteUrl,
			page_location: window.location.href,
			link_text: text
		});
	});

	// 7a. Generic External Exit Tracking (for links not matching github, netlify, or linkedin)
	$(document).on('click', 'a[href^="http://"], a[href^="https://"]', function() {
		var href = $(this).attr('href') || '';
		var absoluteUrl = $(this).prop('href') || href;
		
		if (href.indexOf('linkedin.com') !== -1 || href.indexOf('github.com') !== -1 || href.indexOf('app-truebalance.netlify.app') !== -1) {
			return; // Handled by specific handlers
		}
		
		var text = $(this).text().trim() || 'External Link';
		var destinationName = 'External Link';
		if (href.indexOf('coursera.org') !== -1) {
			destinationName = 'Coursera Credential Verification';
		} else {
			try {
				var urlObj = new URL(absoluteUrl);
				destinationName = urlObj.hostname;
			} catch (e) {}
		}
		
		trackEvent('external_portfolio_exit', {
			destination_name: destinationName,
			link_url: absoluteUrl,
			page_location: window.location.href,
			link_text: text
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

	// 9. Back to Top Scroll Behavior, Scroll Depth Tracking, and Click Event
	var trackedThresholds = {};
	$(window).on('scroll', function() {
		// Back to Top visibility
		if ($(window).scrollTop() > 300) {
			$('#back-to-top').addClass('show');
		} else {
			$('#back-to-top').removeClass('show');
		}

		// Scroll Depth Tracking
		var docHeight = $(document).height();
		var winHeight = $(window).height();
		var scrollTop = $(window).scrollTop();
		
		if (docHeight > winHeight) {
			var scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);
			if (scrollTop + winHeight >= docHeight - 5) {
				scrollPercent = 100;
			}
			
			var milestones = [25, 50, 75, 100];
			milestones.forEach(function(threshold) {
				if (scrollPercent >= threshold && !trackedThresholds[threshold]) {
					trackedThresholds[threshold] = true;
					trackEvent('scroll_depth', {
						scroll_percent: threshold,
						page_location: window.location.href,
						page_title: document.title
					});
				}
			});
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