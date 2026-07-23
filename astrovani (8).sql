-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 23, 2026 at 05:22 PM
-- Server version: 10.6.23-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `astrovani`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_payouts`
--

CREATE TABLE `admin_payouts` (
  `id` bigint(20) NOT NULL,
  `admin_id` bigint(20) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(20) NOT NULL DEFAULT 'bank',
  `note` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_payouts`
--

INSERT INTO `admin_payouts` (`id`, `admin_id`, `amount`, `method`, `note`, `status`, `requested_at`) VALUES
(1, 1, 1000.00, 'bank', 'test', 'pending', '2026-06-26 05:16:27');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'admin',
  `status` varchar(20) DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_number` varchar(30) DEFAULT NULL,
  `bank_ifsc` varchar(20) DEFAULT NULL,
  `bank_holder_name` varchar(100) DEFAULT NULL,
  `upi_id` varchar(100) DEFAULT NULL,
  `preferred_method` varchar(10) DEFAULT 'bank'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `name`, `email`, `password`, `role`, `status`, `last_login`, `created_at`, `updated_at`, `bank_name`, `bank_account_number`, `bank_ifsc`, `bank_holder_name`, `upi_id`, `preferred_method`) VALUES
(1, 'Super Admin', 'admin@astrovani.com', 'admin@astrovani.com', 'superadmin', 'active', '2026-07-21 23:28:47', '2026-05-29 07:03:16', '2026-07-21 17:58:47', 'hdfc', '2828288282', 'sbin22', 'raj shama admin', 'adminupi@717269', 'upi');

-- --------------------------------------------------------

--
-- Table structure for table `app_contents`
--

CREATE TABLE `app_contents` (
  `id` bigint(20) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `target` enum('user','astrologer','both') DEFAULT 'both',
  `meta_key` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_contents`
--

INSERT INTO `app_contents` (`id`, `type`, `target`, `meta_key`, `title`, `content`, `image`, `status`, `created_at`, `updated_at`) VALUES
(1, 'privacy_polic', 'both', 'Privacy Polic', 'Privacy Polic', 'Privacy policy content here', NULL, 'active', '2026-05-23 07:35:36', '2026-06-22 11:37:17'),
(2, 'terms_condition', 'both', 'Terms & Condition', 'Terms & Condition', 'Terms content here', NULL, 'active', '2026-05-23 07:35:36', '2026-06-23 10:49:32'),
(3, 'contact_us', 'both', 'Contact Us', 'Contact Us', 'support@astrovani.com', NULL, 'active', '2026-05-23 07:35:36', '2026-06-14 18:34:41'),
(4, 'faq', 'both', 'FAQ', 'FAQ', '[\r\n  {\r\n    \"question\":\"How recharge works?\",\r\n    \"answer\":\"Recharge instantly using payment gateway.\"\r\n  },\r\n  {\r\n    \"question\":\"How astrologer call works?\",\r\n    \"answer\":\"User can connect directly through app.\"\r\n  }\r\n]', NULL, 'active', '2026-05-23 07:35:36', '2026-06-14 18:34:50'),
(5, 'banner', 'both', 'Home Banner', 'Home Banner', NULL, 'uploads/banner1.png', 'active', '2026-05-23 07:37:31', '2026-06-14 18:34:56'),
(6, 'about_us', 'both', 'About Us', 'About Us', '<h2>About AstroVani</h2><p>Update about us content here.</p>', NULL, 'active', '2026-05-29 06:46:07', '2026-06-14 18:35:04'),
(7, 'maintenance', 'both', NULL, 'Maintenance Mode', 'true', NULL, 'inactive', '2026-05-29 06:46:07', '2026-06-22 11:44:29'),
(27, 'support', 'both', 'whatsapp', 'WhatsApp Support', 'https://wa.me/919999999999', 'whatshappicone.png', 'active', '2026-06-01 12:40:34', '2026-06-15 10:25:02'),
(28, 'support', 'both', 'email', 'Support Email', 'support@gmail.com', 'gmail.png', 'active', '2026-06-01 12:42:38', '2026-06-16 04:06:43'),
(29, 'support', 'both', 'instagram', 'Instagram', 'https://instagram.com/', 'instgram.png', 'active', '2026-06-01 12:43:08', '2026-06-16 04:06:21'),
(30, 'maintenance', 'both', NULL, NULL, '1', NULL, 'active', '2026-06-22 11:56:13', '2026-06-22 11:56:13'),
(31, 'maintenance', 'both', NULL, NULL, '0', NULL, 'inactive', '2026-06-22 11:56:52', '2026-06-22 11:56:52'),
(32, 'privacy_poli', 'both', 'privacy_poli', 'privacy_poli', NULL, NULL, 'active', '2026-06-22 11:57:30', '2026-07-01 07:41:41'),
(39, 'privacy_policy', 'both', NULL, 'Privacy Policy', '<h2><strong>Privacy Policy</strong></h2><p>Last Updated: July 1, 2026</p><p>Welcome to astrovaaani. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how astrovaaani collects, uses, stores, shares, and protects information when you use our mobile applications, website, and related services.</p><h2><strong>1. Information We Collect</strong></h2><p>We may collect the following types of information:</p><h3><strong>Personal Information</strong></h3><ul><li>Full Name</li><li>Mobile Number</li><li>Email Address</li><li>Profile Information</li><li>Date of Birth (if provided)</li><li>Gender (if provided)</li></ul><h3><strong>Account Information</strong></h3><ul><li>Login Credentials</li><li>Account Preferences</li><li>Language Preferences</li><li>User Profile Details</li></ul><h3><strong>Communication Information</strong></h3><ul><li>Chat Messages</li><li>Customer Support Communications</li><li>Feedback and Reviews</li></ul><h3><strong>Call and Live Session Information</strong></h3><ul><li>Audio Call Metadata</li><li>Video Call Metadata</li><li>Live Session Participation Information</li></ul><p>astrovaaani does not monitor or record calls unless explicitly disclosed and permitted by applicable laws.</p><h3><strong>Payment Information</strong></h3><ul><li>Transaction Details</li><li>Wallet Recharge Records</li><li>Purchase History</li><li>Payment Status Information</li></ul><p>Payment card and banking information are processed securely through authorized third-party payment service providers.</p><h3><strong>Device and Technical Information</strong></h3><ul><li>Device Model</li><li>Operating System</li><li>App Version</li><li>IP Address</li><li>Device Identifiers</li><li>Log Information</li></ul><h2><strong>2. How We Use Your Information</strong></h2><p>We use collected information to:</p><ul><li>Create and manage user accounts</li><li>Provide astrology consultation services</li><li>Enable chat, audio, video, and live session features</li><li>Process payments and wallet transactions</li><li>Improve platform performance and security</li><li>Prevent fraud and abuse</li><li>Provide customer support</li><li>Comply with legal obligations</li><li>Send important service notifications</li></ul><h2><strong>3. Information Sharing</strong></h2><p>astrovaaani does not sell personal information to third parties.</p><p>We may share information with:</p><ul><li>Payment Processing Partners</li><li>Cloud Hosting Providers</li><li>Communication Service Providers</li><li>Analytics Providers</li><li>Government Authorities when legally required</li></ul><p>Information is shared only when necessary for service delivery, legal compliance, security, or operational purposes.</p><h2><strong>4. Data Security</strong></h2><p>We implement reasonable administrative, technical, and organizational measures to protect user information against unauthorized access, misuse, loss, alteration, or disclosure.</p><p>However, no system can guarantee absolute security, and users acknowledge that internet-based services carry inherent risks.</p><h2><strong>5. User Content and Communications</strong></h2><p>Users are responsible for information shared during chats, audio calls, video calls, and live sessions.</p><p>Users must not share unlawful, abusive, fraudulent, harmful, or inappropriate content through the platform.</p><h2><strong>6. Data Retention</strong></h2><p>We retain information for as long as necessary to:</p><ul><li>Provide services</li><li>Maintain business records</li><li>Resolve disputes</li><li>Prevent fraud</li><li>Comply with legal obligations</li></ul><p>Information may be deleted, anonymized, or retained according to applicable laws and business requirements.</p><h2><strong>7. Account Deletion</strong></h2><p>Users may request deletion of their account through the application settings or by contacting customer support.</p><p>Upon receiving a valid request, we will process account deletion within a reasonable period, subject to legal, financial, security, and regulatory obligations.</p><p>Certain records may be retained where required by law.</p><h2><strong>8. Children\'s Privacy</strong></h2><p>astrovaaani is not intended for individuals under the age of 18.</p><p>We do not knowingly collect personal information from minors. If such information is identified, appropriate action will be taken to remove it.</p><h2><strong>9. Third-Party Services</strong></h2><p>Our platform may use third-party services including but not limited to:</p><ul><li>Payment Gateways</li><li>Analytics Services</li><li>Cloud Infrastructure Providers</li><li>Notification Services</li><li>Video and Communication Platforms</li></ul><p>These providers operate under their own privacy policies.</p><h2><strong>10. Changes to This Privacy Policy</strong></h2><p>astrovaaani reserves the right to update or modify this Privacy Policy at any time.</p><p>Updated versions will be published on our website and within the application where applicable.</p><p>Continued use of the platform after updates constitutes acceptance of the revised Privacy Policy.</p><h2><strong>11. Contact Us</strong></h2><p>For privacy-related questions, concerns, or requests, please contact:</p><p>Company Name: astrovaaani</p><p>Support Email: support@astrovaaani.com</p><p>Website:<a href=\"https://www.astrovaaani.com/\">&nbsp;https://www.astrovaaani.com</a></p><p>By using astrovaaani, you acknowledge that you have read, understood, and agreed to this Privacy Policy.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:19:56', '2026-07-01 08:19:56'),
(40, 'contact', 'both', NULL, 'Contact Us', '<h2><strong>Contact Us</strong></h2><p>Last Updated: July 1, 2026</p><p>Thank you for using astrovaaani. We value our users and are committed to providing reliable support and assistance. If you have any questions, concerns, feedback, refund requests, technical issues, or account-related inquiries, please feel free to contact us.</p><h2><strong>Customer Support</strong></h2><p>Our support team is available to assist you with:</p><ul><li>Account-related issues</li><li>Login and registration problems</li><li>Wallet and payment queries</li><li>Refund requests</li><li>Chat, audio, video, and live session issues</li><li>Account deletion requests</li><li>Technical support</li><li>Feedback and suggestions</li><li>Reporting abuse or policy violations</li></ul><h2><strong>Contact Information</strong></h2><p><strong>Company Name:</strong> astrovaaani</p><p><strong>Support Email:</strong> support@astrovaaani.com</p><p><strong>Website:</strong><a href=\"https://www.astrovaaani.com\">&nbsp;https://www.astrovaaani.com</a></p><p><strong>Support Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM</p><h2><strong>Reporting Violations</strong></h2><p>If you encounter inappropriate behavior, harassment, fraud, spam, or any activity that violates our policies, please contact us immediately. Our team will review reports and take appropriate action in accordance with our Community Guidelines and Terms &amp; Conditions.</p><h2><strong>Business Inquiries</strong></h2><p>For partnership opportunities, business collaborations, advertising inquiries, or other commercial matters, please contact us through the support email provided above.</p><h2><strong>Response Time</strong></h2><p>We strive to respond to all support requests as quickly as possible. Response times may vary depending on the nature and volume of requests received.</p><h2><strong>Updates</strong></h2><p>astrovaaani may update its contact information from time to time. Any changes will be published on our website and application.</p><p>We appreciate your trust in astrovaaani and thank you for being a part of our community.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:22:11', '2026-07-01 08:54:38'),
(42, 'account_deletion_policy', 'both', NULL, 'Account Deletion Policy', '<h2><strong>Account Deletion Policy</strong></h2><p>Last Updated: July 1, 2026</p><p>astrovaaani respects the privacy and data rights of its users. This Account Deletion Policy explains how users can request deletion of their astrovaaani account and what happens to their information after a deletion request is submitted.</p><p>By using astrovaaani, you acknowledge and agree to this Account Deletion Policy.</p><h2><strong>1. Requesting Account Deletion</strong></h2><p>Users may request deletion of their astrovaaani account at any time through:</p><ul><li>The Account Deletion option available within the astrovaaani application; or</li><li>By contacting our support team using the contact information provided below.</li></ul><p>To protect user privacy and account security, astrovaaani may verify the identity of the account holder before processing a deletion request.</p><h2><strong>2. What Happens After Account Deletion</strong></h2><p>Once an account deletion request is successfully processed:</p><ul><li>The user account will be permanently deactivated.</li><li>Access to the account and associated services will be removed.</li><li>Profile information may be deleted or anonymized.</li><li>Future access to consultation history, wallet information, and account features may no longer be available.</li></ul><p>Account deletion is generally irreversible.</p><h2><strong>3. Data Retention</strong></h2><p>Certain information may be retained for a limited period where required for:</p><ul><li>Legal compliance</li><li>Tax and accounting requirements</li><li>Fraud prevention</li><li>Security investigations</li><li>Dispute resolution</li><li>Regulatory obligations</li></ul><p>Such retained information will only be used for the purposes required by applicable laws and regulations.</p><h2><strong>4. Wallet Balance and Transactions</strong></h2><p>Users are advised to review and utilize any available wallet balance before requesting account deletion.</p><p>Where permitted under applicable policies and laws:</p><ul><li>Transaction records may be retained for financial compliance purposes.</li><li>Previously completed transactions may continue to appear in retained business records.</li><li>Deletion of an account does not automatically cancel completed transactions.</li></ul><h2><strong>5. Consultation Records</strong></h2><p>To comply with legal, security, operational, and business requirements, certain records related to consultations, payments, support requests, or disputes may be retained for a limited period after account deletion.</p><p>Where possible, such information may be anonymized or securely archived.</p><h2><strong>6. Processing Time</strong></h2><p>astrovaaani will make reasonable efforts to process valid account deletion requests within a reasonable timeframe after identity verification and review.</p><p>Processing times may vary depending on technical, legal, security, and operational requirements.</p><h2><strong>7. Re-Registration</strong></h2><p>After deletion, users may create a new account in the future using a valid mobile number, email address, or other supported registration methods, subject to astrovaaani\'s policies and eligibility requirements.</p><h2><strong>8. Fraud, Abuse, and Legal Restrictions</strong></h2><p>astrovaaani reserves the right to delay or deny deletion requests where:</p><ul><li>Fraudulent activity is suspected.</li><li>Ongoing investigations exist.</li><li>Legal obligations require retention of information.</li><li>Account restrictions or disputes are pending.</li></ul><h2><strong>9. Changes to This Policy</strong></h2><p>astrovaaani reserves the right to modify this Account Deletion Policy at any time.</p><p>Updated versions will be published on the platform or website and will become effective upon publication.</p><h2><strong>10. Contact Us</strong></h2><p>If you wish to request account deletion or have questions regarding this policy, please contact:</p><p>Company Name: astrovaaani</p><p>Email: support@astrovaaani.com</p><p>Website:<a href=\"https://www.astrovaaani.com\">&nbsp;https://www.astrovaaani.com</a></p><p>Please include your registered mobile number and account details when submitting a deletion request.</p><p>By using astrovaaani, you acknowledge that you have read, understood, and agreed to this Account Deletion Policy.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:22:29', '2026-07-01 08:22:29'),
(44, 'disclaimer', 'both', NULL, 'Disclaimer', '<h2><strong>Disclaimer</strong></h2><p>Last Updated: July 1, 2026</p><p>Welcome to astrovaaani. This Disclaimer governs your use of the astrovaaani platform, including our mobile applications, website, chat consultations, audio calls, video calls, live sessions, and all related services.</p><p>By accessing or using astrovaaani, you acknowledge and agree to the terms of this Disclaimer.</p><h2><strong>1. General Information</strong></h2><p>astrovaaani is an online platform that connects users with independent astrologers for astrology-related consultations and guidance.</p><p>All consultations, opinions, predictions, interpretations, recommendations, and suggestions provided by astrologers are based on their personal knowledge, experience, beliefs, and interpretation of astrological principles.</p><p>astrovaaani does not independently verify, endorse, guarantee, or warrant the accuracy of any consultation, prediction, or advice provided by astrologers on the platform.</p><h2><strong>2. No Guarantee of Results</strong></h2><p>Astrology is a subjective practice and should be considered a form of personal guidance.</p><p>astrovaaani does not guarantee:</p><ul><li>Accuracy of predictions</li><li>Future outcomes</li><li>Financial gains</li><li>Business success</li><li>Relationship success</li><li>Marriage outcomes</li><li>Career growth</li><li>Educational results</li><li>Health improvements</li><li>Personal achievements</li></ul><p>Results may vary from person to person, and users acknowledge that no outcome is guaranteed.</p><h2><strong>3. Personal Responsibility</strong></h2><p>Users are solely responsible for their decisions, actions, and outcomes arising from consultations received through astrovaaani.</p><p>Any decisions related to:</p><ul><li>Finance</li><li>Investments</li><li>Employment</li><li>Education</li><li>Relationships</li><li>Marriage</li><li>Health</li><li>Legal matters</li><li>Business activities</li></ul><p>should be made at the user\'s own discretion and responsibility.</p><h2><strong>4. Not Professional Advice</strong></h2><p>Information provided through astrovaaani is not intended to replace professional advice.</p><p>Astrology consultations should not be considered a substitute for:</p><ul><li>Medical advice</li><li>Psychological counseling</li><li>Psychiatric treatment</li><li>Legal advice</li><li>Financial advice</li><li>Investment advice</li><li>Tax advice</li><li>Professional consulting services</li></ul><p>Users should consult appropriately qualified professionals for such matters.</p><h2><strong>5. Health Disclaimer</strong></h2><p>Astrologers available through astrovaaani are not medical professionals unless specifically stated otherwise.</p><p>Users should never delay, ignore, or discontinue professional medical treatment based on astrological consultations received through the platform.</p><p>For medical concerns, users should consult licensed healthcare professionals.</p><h2><strong>6. Financial and Investment Disclaimer</strong></h2><p>astrovaaani does not provide investment, trading, stock market, cryptocurrency, banking, or financial advisory services.</p><p>Users should not rely on astrological consultations as the sole basis for making financial or investment decisions.</p><p>Any financial decisions made by users are entirely at their own risk.</p><h2><strong>7. User-Astrologer Interactions</strong></h2><p>astrovaaani acts solely as a technology platform facilitating communication between users and astrologers.</p><p>astrovaaani is not responsible for:</p><ul><li>Statements made by astrologers</li><li>Predictions or interpretations</li><li>Advice provided during consultations</li><li>User reliance on consultation outcomes</li></ul><p>Responsibility for consultation content remains with the respective astrologer.</p><h2><strong>8. Technical Availability</strong></h2><p>While astrovaaani strives to provide uninterrupted services, we do not guarantee that the platform will always be available, error-free, secure, or uninterrupted.</p><p>Temporary disruptions may occur due to:</p><ul><li>Maintenance activities</li><li>Internet issues</li><li>Third-party service failures</li><li>Technical problems</li><li>Force majeure events</li></ul><h2><strong>9. Limitation of Liability</strong></h2><p>To the maximum extent permitted by applicable law, astrovaaani, its owners, directors, employees, affiliates, partners, and service providers shall not be liable for:</p><ul><li>Direct losses</li><li>Indirect losses</li><li>Financial losses</li><li>Business losses</li><li>Emotional distress</li><li>Missed opportunities</li><li>Consequential damages</li></ul><p>arising from the use of the platform or reliance on astrology consultations.</p><h2><strong>10. User Acknowledgement</strong></h2><p>By using astrovaaani, you acknowledge and agree that:</p><ul><li>Astrology is based on personal interpretation.</li><li>Consultations are intended for guidance and informational purposes only.</li><li>No prediction or consultation outcome is guaranteed.</li><li>You assume full responsibility for decisions made based on consultations.</li><li>astrovaaani shall not be responsible for the consequences of any user decisions.</li></ul><h2><strong>11. Changes to This Disclaimer</strong></h2><p>astrovaaani reserves the right to modify or update this Disclaimer at any time.</p><p>Updated versions will be published on the platform and become effective immediately upon publication.</p><h2><strong>12. Contact Us</strong></h2><p>If you have any questions regarding this Disclaimer, please contact:</p><p>Company Name: astrovaaani</p><p>Email: support@astrovaaani.com</p><p>Website:<a href=\"https://www.astrovaaani.com\">&nbsp;https://www.astrovaaani.com</a></p><p>By accessing or using astrovaaani, you confirm that you have read, understood, and agreed to this Disclaimer.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:22:48', '2026-07-01 08:22:48'),
(45, 'community_guidelines', 'both', NULL, 'Community Guidelines', '<h2><strong>Community Guidelines</strong></h2><p>Last Updated: July 1, 2026</p><p>At astrovaaani, we are committed to creating a safe, respectful, and trustworthy environment for all users and astrologers. These Community Guidelines apply to everyone using the astrovaaani platform, including users, astrologers, and any other participants in chats, calls, video sessions, live sessions, reviews, or other interactive features.</p><p>By using astrovaaani, you agree to follow these Community Guidelines.</p><h2><strong>1. Respect Others</strong></h2><p>All users and astrologers must treat each other with courtesy and respect.</p><p>The following behavior is prohibited:</p><ul><li>Harassment or bullying</li><li>Threats or intimidation</li><li>Hate speech or discriminatory remarks</li><li>Personal attacks</li><li>Abusive or offensive language</li><li>Defamation of individuals or organizations</li></ul><p>Respectful communication helps maintain a positive experience for everyone.</p><h2><strong>2. No Illegal Activities</strong></h2><p>Users must not use astrovaaani for any unlawful purpose.</p><p>Prohibited activities include:</p><ul><li>Fraud or scams</li><li>Money laundering</li><li>Identity theft</li><li>Distribution of illegal content</li><li>Promotion of criminal activities</li><li>Violation of applicable laws or regulations</li></ul><p>Any suspected illegal activity may be reported to appropriate authorities where required by law.</p><h2><strong>3. No Sexual or Explicit Content</strong></h2><p>astrovaaani is a professional astrology consultation platform.</p><p>Users and astrologers must not:</p><ul><li>Share sexually explicit content</li><li>Request sexual services</li><li>Send obscene images or videos</li><li>Use sexually abusive language</li><li>Engage in inappropriate behavior during chats, calls, or live sessions</li></ul><p>Violation of this rule may result in immediate account suspension.</p><h2><strong>4. No Harassment of Astrologers or Users</strong></h2><p>Users must not:</p><ul><li>Repeatedly contact individuals against their wishes</li><li>Make offensive comments</li><li>Use threatening language</li><li>Attempt to intimidate astrologers or other users</li></ul><p>Astrologers are also expected to maintain professional conduct at all times.</p><h2><strong>5. Authentic Information</strong></h2><p>Users and astrologers must provide accurate information when creating profiles and using platform services.</p><p>Do not:</p><ul><li>Create fake accounts</li><li>Impersonate another person</li><li>Misrepresent qualifications or experience</li><li>Use misleading profile information</li></ul><p>Verified information helps maintain trust across the platform.</p><h2><strong>6. Misuse of Services</strong></h2><p>The following activities are prohibited:</p><ul><li>Spamming</li><li>Sending unwanted promotional messages</li><li>Unauthorized advertising</li><li>Automated account creation</li><li>Use of bots or scripts</li><li>Attempting to disrupt platform operations</li></ul><p>Any abuse of platform resources may result in account restrictions.</p><h2><strong>7. Live Session Conduct</strong></h2><p>During live sessions:</p><ul><li>Maintain respectful behavior.</li><li>Avoid offensive language.</li><li>Do not promote illegal activities.</li><li>Do not harass participants.</li><li>Do not share inappropriate content.</li></ul><p>astrovaaani reserves the right to remove users from live sessions that violate these guidelines.</p><h2><strong>8. User-Generated Content</strong></h2><p>Users are responsible for all content they share, including:</p><ul><li>Messages</li><li>Reviews</li><li>Profile information</li><li>Comments</li><li>Live session interactions</li></ul><p>Content that is illegal, abusive, harmful, misleading, defamatory, or otherwise inappropriate may be removed without notice.</p><h2><strong>9. Reporting Violations</strong></h2><p>If you encounter behavior that violates these guidelines, you may use the available reporting tools or contact customer support.</p><p>Reports may be reviewed by our moderation team, and appropriate action may be taken.</p><h2><strong>10. Enforcement Actions</strong></h2><p>astrovaaani may take one or more of the following actions against accounts that violate these Community Guidelines:</p><ul><li>Warning notices</li><li>Content removal</li><li>Temporary restrictions</li><li>Suspension of features</li><li>Permanent account suspension</li><li>Permanent account termination</li></ul><p>The severity of action will depend on the nature and frequency of violations.</p><h2><strong>11. Safety and Privacy</strong></h2><p>For your safety:</p><ul><li>Do not share sensitive personal information.</li><li>Do not share banking credentials, passwords, or OTPs.</li><li>Be cautious when communicating with others.</li><li>Report suspicious activity immediately.</li></ul><p>astrovaaani will never request passwords or OTPs through chats, calls, or messages.</p><h2><strong>12. Updates to These Guidelines</strong></h2><p>astrovaaani reserves the right to update these Community Guidelines at any time.</p><p>Updated versions will be published on the platform and will become effective upon publication.</p><h2><strong>13. Contact Us</strong></h2><p>For questions, concerns, or reporting violations, please contact:</p><p>Company Name: astrovaaani</p><p>Email: support@astrovaaani.com</p><p>Website:<a href=\"https://www.astrovaaani.com\">&nbsp;https://www.astrovaaani.com</a></p><p>By using astrovaaani, you acknowledge and agree to follow these Community Guidelines.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:24:07', '2026-07-01 08:24:07'),
(46, 'refund_cancellation', 'both', NULL, 'Refund & Cancellation Policy', '<h2><strong>Refund &amp; Cancellation Policy</strong></h2><p>Last Updated: July 1, 2026</p><p>Thank you for using astrovaaani. This Refund &amp; Cancellation Policy explains the rules and conditions governing refunds, cancellations, wallet transactions, and service-related payment disputes on the astrovaaani platform.</p><p>By using astrovaaani and making payments through the platform, you agree to this Refund &amp; Cancellation Policy.</p><h2><strong>1. General Policy</strong></h2><p>astrovaaani provides digital consultation services through chat, audio calls, video calls, live sessions, and other astrology-related services.</p><p>Due to the nature of digital and consultation-based services, payments made for completed services are generally non-refundable.</p><p>Refund requests will be reviewed on a case-by-case basis and may be approved only under specific circumstances described in this policy.</p><h2><strong>2. Wallet Recharge Policy</strong></h2><p>Users may add funds to their astrovaaani wallet using available payment methods.</p><p>Once a wallet recharge is successfully completed and the amount has been credited to the user\'s wallet, the recharge amount is generally non-refundable and cannot be withdrawn as cash.</p><p>Users are advised to verify the recharge amount before completing any transaction.</p><h2><strong>3. Failed Transactions</strong></h2><p>If a payment is deducted from the user\'s bank account, card, UPI, or payment method but the wallet is not credited or the service is not activated, users may contact customer support.</p><p>After verification, the amount may be:</p><ul><li>Automatically reversed by the payment provider, or</li><li>Credited to the user\'s wallet, or</li><li>Refunded through the original payment method where applicable.</li></ul><p>Processing times may vary depending on the payment provider and banking systems.</p><h2><strong>4. Duplicate Payments</strong></h2><p>If a user is charged multiple times for the same transaction due to a technical issue, duplicate payment(s) may be refunded after successful verification.</p><p>astrovaaani reserves the right to request transaction details and supporting evidence before processing any refund.</p><h2><strong>5. Chat Consultation Refunds</strong></h2><p>Refunds for chat consultations may be considered only if:</p><ul><li>The astrologer does not respond within the applicable waiting period.</li><li>The consultation cannot be completed due to technical issues attributable to the platform.</li><li>The service was not delivered as intended.</li></ul><p>Refunds will not be provided merely because a user is dissatisfied with the advice, guidance, or predictions received.</p><h2><strong>6. Audio and Video Consultation Refunds</strong></h2><p>Refund requests for audio or video consultations may be reviewed if:</p><ul><li>The consultation could not start due to a verified technical issue.</li><li>The astrologer failed to attend the scheduled session.</li><li>The service was interrupted due to platform-related technical failures.</li></ul><p>Refunds will not be granted after a consultation has been substantially completed.</p><h2><strong>7. Live Session Refunds</strong></h2><p>Payments made for live sessions, live events, or premium live content are generally non-refundable once access has been provided.</p><p>Exceptions may be made in cases of:</p><ul><li>Technical failures preventing access.</li><li>Event cancellation by astrovaaani.</li><li>Verified platform errors.</li></ul><h2><strong>8. User Cancellations</strong></h2><p>If a user voluntarily disconnects, exits, leaves, or cancels a consultation after the session has begun, no refund shall be provided.</p><p>Users are responsible for ensuring stable internet connectivity and device compatibility before initiating consultations.</p><h2><strong>9. Astrologer Unavailability</strong></h2><p>Where an astrologer becomes unavailable after a booking or payment:</p><ul><li>The session may be rescheduled, or</li><li>The applicable amount may be refunded or credited to the user\'s wallet, at astrovaaani\'s discretion.</li></ul><h2><strong>10. Non-Refundable Situations</strong></h2><p>Refunds will not be provided for:</p><ul><li>Dissatisfaction with astrological predictions.</li><li>Personal disagreement with consultation advice.</li><li>Incorrect decisions made based on consultations.</li><li>User-side internet or device issues.</li><li>Voluntary disconnection from sessions.</li><li>Services already delivered successfully.</li><li>Promotional, bonus, or reward credits.</li></ul><h2><strong>11. Refund Processing</strong></h2><p>Approved refunds will generally be processed through the original payment method or wallet credit, depending on the nature of the transaction.</p><p>Processing timelines may vary based on banks, payment gateways, and financial institutions.</p><h2><strong>12. Abuse and Fraud Prevention</strong></h2><p>astrovaaani reserves the right to reject refund requests where:</p><ul><li>Fraudulent activity is suspected.</li><li>False claims are made.</li><li>Platform policies have been violated.</li><li>Excessive or abusive refund requests are detected.</li></ul><h2><strong>13. Changes to This Policy</strong></h2><p>astrovaaani reserves the right to modify this Refund &amp; Cancellation Policy at any time.</p><p>Any updates will be published on the platform and become effective upon publication.</p><h2><strong>14. Contact Us</strong></h2><p>For refund-related queries or assistance, please contact:</p><p>Company Name: astrovaaani</p><p>Email: support@astrovaaani.com</p><p>Website:<a href=\"https://www.astrovaaani.com\">&nbsp;https://www.astrovaaani.com</a></p><p>Please include your registered mobile number, transaction ID, payment date, and issue details when contacting support.</p><p>By using astrovaaani and making payments through the platform, you acknowledge and agree to this Refund &amp; Cancellation Policy.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:24:23', '2026-07-01 08:24:23'),
(48, 'terms_conditions', 'both', NULL, 'Terms & Conditions', '<h2><strong>Terms &amp; Conditions</strong></h2><p>Last Updated: July 1, 2026</p><p>Welcome to astrovaaani. These Terms &amp; Conditions govern your access to and use of the astrovaaani mobile applications, website, and related services. By registering, accessing, or using astrovaaani, you agree to be bound by these Terms &amp; Conditions.</p><h2><strong>1. Acceptance of Terms</strong></h2><p>By creating an account or using astrovaaani, you acknowledge that you have read, understood, and agreed to these Terms &amp; Conditions, our Privacy Policy, and other applicable policies.</p><p>If you do not agree with any part of these Terms, you must discontinue use of the platform immediately.</p><h2><strong>2. About astrovaaani</strong></h2><p>astrovaaani is an online platform that enables users to connect with astrologers through:</p><ul><li>Chat Consultations</li><li>Audio Calls</li><li>Video Calls</li><li>Live Sessions</li><li>Other astrology-related services made available through the platform</li></ul><p>astrovaaani acts as a technology platform facilitating communication between users and astrologers.</p><h2><strong>3. Eligibility</strong></h2><p>To use astrovaaani, you must:</p><ul><li>Be at least 18 years of age.</li><li>Have the legal capacity to enter into binding agreements.</li><li>Provide accurate and complete registration information.</li></ul><p>astrovaaani reserves the right to refuse service or terminate accounts that do not meet eligibility requirements.</p><h2><strong>4. User Accounts</strong></h2><p>Users are responsible for:</p><ul><li>Maintaining the confidentiality of account credentials.</li><li>All activities performed through their account.</li><li>Providing accurate and up-to-date information.</li></ul><p>You must immediately notify astrovaaani of any unauthorized use of your account.</p><h2><strong>5. Astrologer Services</strong></h2><p>Astrologers available on astrovaaani provide consultations based on their personal knowledge, experience, and interpretation of astrology.</p><p>astrovaaani does not guarantee:</p><ul><li>Accuracy of predictions</li><li>Specific outcomes</li><li>Financial gains</li><li>Relationship success</li><li>Health improvements</li><li>Career results</li></ul><p>Users acknowledge that all consultations are obtained at their own discretion.</p><h2><strong>6. Payments and Wallet</strong></h2><p>Users may purchase services through supported payment methods available on the platform.</p><p>By making a payment, you agree that:</p><ul><li>Charges are applicable according to displayed pricing.</li><li>Wallet balances are subject to platform rules.</li><li>Transaction records will be maintained for operational and legal purposes.</li><li>Additional taxes or charges may apply where required by law.</li></ul><h2><strong>7. Refunds</strong></h2><p>Refunds are governed by astrovaaani\'s Refund &amp; Cancellation Policy.</p><p>Approval of refunds shall be subject to review and verification by astrovaaani.</p><h2><strong>8. Prohibited Activities</strong></h2><p>Users shall not:</p><ul><li>Violate any applicable law or regulation.</li><li>Harass, abuse, threaten, or intimidate others.</li><li>Share obscene, offensive, hateful, or illegal content.</li><li>Impersonate another individual or entity.</li><li>Attempt unauthorized access to platform systems.</li><li>Use automated systems, bots, or scripts to manipulate the platform.</li><li>Engage in fraudulent payment activities.</li></ul><p>Violation of these provisions may result in suspension or permanent termination of the account.</p><h2><strong>9. User-Generated Content</strong></h2><p>Users are solely responsible for content shared through:</p><ul><li>Chats</li><li>Messages</li><li>Live Sessions</li><li>Reviews</li><li>Feedback</li><li>Profile Information</li></ul><p>astrovaaani reserves the right to remove content that violates these Terms, Community Guidelines, or applicable laws.</p><h2><strong>10. Suspension and Termination</strong></h2><p>astrovaaani may suspend, restrict, or permanently terminate accounts without prior notice if:</p><ul><li>These Terms are violated.</li><li>Fraudulent activity is detected.</li><li>User behavior poses risks to other users or the platform.</li><li>Required legal obligations necessitate such action.</li></ul><h2><strong>11. Intellectual Property</strong></h2><p>All content, trademarks, logos, designs, software, graphics, and materials associated with astrovaaani are owned by or licensed to astrovaaani.</p><p>Users may not copy, reproduce, distribute, modify, or commercially exploit any platform content without prior written permission.</p><h2><strong>12. Limitation of Liability</strong></h2><p>To the maximum extent permitted by law, astrovaaani shall not be liable for:</p><ul><li>Astrological predictions or outcomes.</li><li>User decisions based on consultations.</li><li>Financial losses.</li><li>Business losses.</li><li>Emotional distress.</li><li>Service interruptions.</li><li>Technical failures beyond reasonable control.</li></ul><p>Users assume full responsibility for decisions made based on information received through the platform.</p><h2><strong>13. Disclaimer</strong></h2><p>Astrology services provided through astrovaaani are intended for guidance, informational, and entertainment purposes only.</p><p>Consultations should not be considered substitutes for professional medical, legal, financial, psychological, or other professional advice.</p><h2><strong>14. Privacy</strong></h2><p>Collection and processing of personal information are governed by our Privacy Policy.</p><p>By using astrovaaani, you consent to such collection and processing.</p><h2><strong>15. Modifications</strong></h2><p>astrovaaani reserves the right to modify these Terms &amp; Conditions at any time.</p><p>Updated versions will be published through the platform or website. Continued use of the platform after updates constitutes acceptance of the revised Terms.</p><h2><strong>16. Governing Law</strong></h2><p>These Terms &amp; Conditions shall be governed by and interpreted in accordance with the laws applicable in the jurisdiction where astrovaaani operates.</p><p>Any disputes arising from the use of the platform shall be subject to the exclusive jurisdiction of the competent courts.</p><h2><strong>17. Contact Us</strong></h2><p>For questions regarding these Terms &amp; Conditions, please contact:</p><p>Company Name: astrovaaani</p><p>Email: support@astrovaaani.com</p><p>Website:<a href=\"https://www.astrovaaani.com\">&nbsp;https://www.astrovaaani.com</a></p><p>By using astrovaaani, you acknowledge and agree to these Terms &amp; Conditions.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:24:45', '2026-07-01 08:24:45'),
(49, 'privacy_policy', 'both', NULL, 'Privacy Policy', '<h2><strong>Privacy Policy</strong></h2><p>Last Updated: July 1, 2026</p><p>Welcome to astrovaaani. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how astrovaaani collects, uses, stores, shares, and protects information when you use our mobile applications, website, and related services.</p><h2><strong>1. Information We Collect</strong></h2><p>We may collect the following types of information:</p><h3><strong>Personal Information</strong></h3><ul><li>Full Name</li><li>Mobile Number</li><li>Email Address</li><li>Profile Information</li><li>Date of Birth (if provided)</li><li>Gender (if provided)</li></ul><h3><strong>Account Information</strong></h3><ul><li>Login Credentials</li><li>Account Preferences</li><li>Language Preferences</li><li>User Profile Details</li></ul><h3><strong>Communication Information</strong></h3><ul><li>Chat Messages</li><li>Customer Support Communications</li><li>Feedback and Reviews</li></ul><h3><strong>Call and Live Session Information</strong></h3><ul><li>Audio Call Metadata</li><li>Video Call Metadata</li><li>Live Session Participation Information</li></ul><p>astrovaaani does not monitor or record calls unless explicitly disclosed and permitted by applicable laws.</p><h3><strong>Payment Information</strong></h3><ul><li>Transaction Details</li><li>Wallet Recharge Records</li><li>Purchase History</li><li>Payment Status Information</li></ul><p>Payment card and banking information are processed securely through authorized third-party payment service providers.</p><h3><strong>Device and Technical Information</strong></h3><ul><li>Device Model</li><li>Operating System</li><li>App Version</li><li>IP Address</li><li>Device Identifiers</li><li>Log Information</li></ul><h2><strong>2. How We Use Your Information</strong></h2><p>We use collected information to:</p><ul><li>Create and manage user accounts</li><li>Provide astrology consultation services</li><li>Enable chat, audio, video, and live session features</li><li>Process payments and wallet transactions</li><li>Improve platform performance and security</li><li>Prevent fraud and abuse</li><li>Provide customer support</li><li>Comply with legal obligations</li><li>Send important service notifications</li></ul><h2><strong>3. Information Sharing</strong></h2><p>astrovaaani does not sell personal information to third parties.</p><p>We may share information with:</p><ul><li>Payment Processing Partners</li><li>Cloud Hosting Providers</li><li>Communication Service Providers</li><li>Analytics Providers</li><li>Government Authorities when legally required</li></ul><p>Information is shared only when necessary for service delivery, legal compliance, security, or operational purposes.</p><h2><strong>4. Data Security</strong></h2><p>We implement reasonable administrative, technical, and organizational measures to protect user information against unauthorized access, misuse, loss, alteration, or disclosure.</p><p>However, no system can guarantee absolute security, and users acknowledge that internet-based services carry inherent risks.</p><h2><strong>5. User Content and Communications</strong></h2><p>Users are responsible for information shared during chats, audio calls, video calls, and live sessions.</p><p>Users must not share unlawful, abusive, fraudulent, harmful, or inappropriate content through the platform.</p><h2><strong>6. Data Retention</strong></h2><p>We retain information for as long as necessary to:</p><ul><li>Provide services</li><li>Maintain business records</li><li>Resolve disputes</li><li>Prevent fraud</li><li>Comply with legal obligations</li></ul><p>Information may be deleted, anonymized, or retained according to applicable laws and business requirements.</p><h2><strong>7. Account Deletion</strong></h2><p>Users may request deletion of their account through the application settings or by contacting customer support.</p><p>Upon receiving a valid request, we will process account deletion within a reasonable period, subject to legal, financial, security, and regulatory obligations.</p><p>Certain records may be retained where required by law.</p><h2><strong>8. Children\'s Privacy</strong></h2><p>astrovaaani is not intended for individuals under the age of 18.</p><p>We do not knowingly collect personal information from minors. If such information is identified, appropriate action will be taken to remove it.</p><h2><strong>9. Third-Party Services</strong></h2><p>Our platform may use third-party services including but not limited to:</p><ul><li>Payment Gateways</li><li>Analytics Services</li><li>Cloud Infrastructure Providers</li><li>Notification Services</li><li>Video and Communication Platforms</li></ul><p>These providers operate under their own privacy policies.</p><h2><strong>10. Changes to This Privacy Policy</strong></h2><p>astrovaaani reserves the right to update or modify this Privacy Policy at any time.</p><p>Updated versions will be published on our website and within the application where applicable.</p><p>Continued use of the platform after updates constitutes acceptance of the revised Privacy Policy.</p><h2><strong>11. Contact Us</strong></h2><p>For privacy-related questions, concerns, or requests, please contact:</p><p>Company Name: astrovaaani</p><p>Support Email: support@astrovaaani.com</p><p>Website:<a href=\"https://www.astrovaaani.com/\">&nbsp;https://www.astrovaaani.com</a></p><p>By using astrovaaani, you acknowledge that you have read, understood, and agreed to this Privacy Policy.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:25:16', '2026-07-01 08:25:16');
INSERT INTO `app_contents` (`id`, `type`, `target`, `meta_key`, `title`, `content`, `image`, `status`, `created_at`, `updated_at`) VALUES
(50, 'privacy_policy', 'both', NULL, 'Privacy Policy', '<h2><strong>Privacy Policy</strong></h2><p>Last Updated: July 1, 2026</p><p>Welcome to astrovaaani. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how astrovaaani collects, uses, stores, shares, and protects information when you use our mobile applications, website, and related services.</p><h2><strong>1. Information We Collect</strong></h2><p>We may collect the following types of information:</p><h3><strong>Personal Information</strong></h3><ul><li>Full Name</li><li>Mobile Number</li><li>Email Address</li><li>Profile Information</li><li>Date of Birth (if provided)</li><li>Gender (if provided)</li></ul><h3><strong>Account Information</strong></h3><ul><li>Login Credentials</li><li>Account Preferences</li><li>Language Preferences</li><li>User Profile Details</li></ul><h3><strong>Communication Information</strong></h3><ul><li>Chat Messages</li><li>Customer Support Communications</li><li>Feedback and Reviews</li></ul><h3><strong>Call and Live Session Information</strong></h3><ul><li>Audio Call Metadata</li><li>Video Call Metadata</li><li>Live Session Participation Information</li></ul><p>astrovaaani does not monitor or record calls unless explicitly disclosed and permitted by applicable laws.</p><h3><strong>Payment Information</strong></h3><ul><li>Transaction Details</li><li>Wallet Recharge Records</li><li>Purchase History</li><li>Payment Status Information</li></ul><p>Payment card and banking information are processed securely through authorized third-party payment service providers.</p><h3><strong>Device and Technical Information</strong></h3><ul><li>Device Model</li><li>Operating System</li><li>App Version</li><li>IP Address</li><li>Device Identifiers</li><li>Log Information</li></ul><h2><strong>2. How We Use Your Information</strong></h2><p>We use collected information to:</p><ul><li>Create and manage user accounts</li><li>Provide astrology consultation services</li><li>Enable chat, audio, video, and live session features</li><li>Process payments and wallet transactions</li><li>Improve platform performance and security</li><li>Prevent fraud and abuse</li><li>Provide customer support</li><li>Comply with legal obligations</li><li>Send important service notifications</li></ul><h2><strong>3. Information Sharing</strong></h2><p>astrovaaani does not sell personal information to third parties.</p><p>We may share information with:</p><ul><li>Payment Processing Partners</li><li>Cloud Hosting Providers</li><li>Communication Service Providers</li><li>Analytics Providers</li><li>Government Authorities when legally required</li></ul><p>Information is shared only when necessary for service delivery, legal compliance, security, or operational purposes.</p><h2><strong>4. Data Security</strong></h2><p>We implement reasonable administrative, technical, and organizational measures to protect user information against unauthorized access, misuse, loss, alteration, or disclosure.</p><p>However, no system can guarantee absolute security, and users acknowledge that internet-based services carry inherent risks.</p><h2><strong>5. User Content and Communications</strong></h2><p>Users are responsible for information shared during chats, audio calls, video calls, and live sessions.</p><p>Users must not share unlawful, abusive, fraudulent, harmful, or inappropriate content through the platform.</p><h2><strong>6. Data Retention</strong></h2><p>We retain information for as long as necessary to:</p><ul><li>Provide services</li><li>Maintain business records</li><li>Resolve disputes</li><li>Prevent fraud</li><li>Comply with legal obligations</li></ul><p>Information may be deleted, anonymized, or retained according to applicable laws and business requirements.</p><h2><strong>7. Account Deletion</strong></h2><p>Users may request deletion of their account through the application settings or by contacting customer support.</p><p>Upon receiving a valid request, we will process account deletion within a reasonable period, subject to legal, financial, security, and regulatory obligations.</p><p>Certain records may be retained where required by law.</p><h2><strong>8. Children\'s Privacy</strong></h2><p>astrovaaani is not intended for individuals under the age of 18.</p><p>We do not knowingly collect personal information from minors. If such information is identified, appropriate action will be taken to remove it.</p><h2><strong>9. Third-Party Services</strong></h2><p>Our platform may use third-party services including but not limited to:</p><ul><li>Payment Gateways</li><li>Analytics Services</li><li>Cloud Infrastructure Providers</li><li>Notification Services</li><li>Video and Communication Platforms</li></ul><p>These providers operate under their own privacy policies.</p><h2><strong>10. Changes to This Privacy Policy</strong></h2><p>astrovaaani reserves the right to update or modify this Privacy Policy at any time.</p><p>Updated versions will be published on our website and within the application where applicable.</p><p>Continued use of the platform after updates constitutes acceptance of the revised Privacy Policy.</p><h2><strong>11. Contact Us</strong></h2><p>For privacy-related questions, concerns, or requests, please contact:</p><p>Company Name: astrovaaani</p><p>Support Email: support@astrovaaani.com</p><p>Website:<a href=\"https://www.astrovaaani.com/\">&nbsp;https://www.astrovaaani.com</a></p><p>By using astrovaaani, you acknowledge that you have read, understood, and agreed to this Privacy Policy.</p><p>&nbsp;</p>', NULL, 'active', '2026-07-01 08:25:18', '2026-07-01 08:25:18');

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `id` int(11) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`id`, `key`, `value`, `updated_at`) VALUES
(1, 'maintenance_mode', '0', '2026-05-29 06:46:07'),
(2, 'call_rate', '20', '2026-05-29 06:46:07'),
(3, 'chat_rate', '15', '2026-05-29 06:46:07'),
(4, 'audio_rate', '25', '2026-05-29 06:46:07'),
(5, 'video_rate', '30', '2026-05-29 06:46:07'),
(6, 'commission_default', '20', '2026-05-29 06:46:07'),
(7, 'min_withdrawal', '500', '2026-05-29 06:46:07'),
(8, 'referral_bonus', '50', '2026-05-29 06:46:07'),
(9, 'app_name', 'AstroVani', '2026-05-29 06:46:07'),
(10, 'support_email', 'support@astrovani.com', '2026-05-29 06:46:07'),
(11, 'support_phone', '+91 9800000000', '2026-05-29 06:46:07'),
(46, 'privacy_policy', '<h2>Privacy Policy</h2>\n<p><strong>Last updated: January 1, 2025</strong></p>\n<h3>1. Information We Collect</h3>\n<p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email, phone number, and payment information.</p>\n<h3>2. How We Use Your Information</h3>\n<p>We use the information we collect to provide, maintain, and improve our services, process transactions, and send you technical notices and support messages.</p>\n<h3>3. Information Sharing</h3>\n<p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>\n<h3>4. Data Security</h3>\n<p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>\n<h3>5. Cookies</h3>\n<p>We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve user experience.</p>\n<h3>6. Contact Us</h3>\n<p>If you have any questions about this Privacy Policy, please contact us at <strong>privacy@astrovani.com</strong></p>', '2026-06-20 10:29:01'),
(47, 'terms', '<h2>Terms &amp; Conditions</h2>\n<p><strong>Last updated: January 1, 2025</strong></p>\n<h3>1. Acceptance of Terms</h3>\n<p>By accessing and using AstroVani, you accept and agree to be bound by the terms and provision of this agreement.</p>\n<h3>2. Use of Service</h3>\n<p>AstroVani provides astrological consultation services. All consultations are for <strong>entertainment purposes only</strong>.</p>\n<h3>3. Payment Terms</h3>\n<p>All payments are processed securely. Refunds are subject to our refund policy. Wallet balance is non-transferable.</p>\n<h3>4. User Conduct</h3>\n<p>Users must not misuse the platform or engage in any fraudulent activity. Violation may result in account termination.</p>\n<h3>5. Disclaimer</h3>\n<p>Astrological readings are for entertainment purposes. We do not guarantee accuracy of predictions or outcomes.</p>\n<h3>6. Contact</h3>\n<p>For questions regarding these terms, contact <strong>legal@astrovani.com</strong></p>', '2026-06-20 10:47:13');

-- --------------------------------------------------------

--
-- Table structure for table `astrologers`
--

CREATE TABLE `astrologers` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `fcm_token` text DEFAULT NULL,
  `device_type` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `total_reviews` int(11) DEFAULT 0,
  `total_sessions` int(11) DEFAULT 0,
  `total_chats` int(11) DEFAULT 0,
  `total_audio` int(11) DEFAULT 0,
  `total_video` int(11) DEFAULT 0,
  `total_chat_minutes` int(11) DEFAULT 0,
  `total_audio_minutes` int(11) DEFAULT 0,
  `total_video_minutes` int(11) DEFAULT 0,
  `total_earnings` decimal(12,2) DEFAULT 0.00,
  `wallet_balance` decimal(12,2) DEFAULT 0.00,
  `commission_percent` decimal(5,2) DEFAULT 20.00,
  `education` varchar(255) DEFAULT NULL,
  `education_cert` varchar(255) DEFAULT NULL,
  `astro_cert` varchar(255) DEFAULT NULL,
  `id_proof` varchar(255) DEFAULT NULL,
  `address_proof` varchar(255) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `account_holder` varchar(100) DEFAULT NULL,
  `upi_id` varchar(100) DEFAULT NULL,
  `languages` varchar(255) DEFAULT NULL,
  `expertise` varchar(255) DEFAULT NULL,
  `chat_charge` decimal(10,2) DEFAULT 0.00,
  `audio_charge` decimal(10,2) DEFAULT 0.00,
  `video_charge` decimal(10,2) DEFAULT 0.00,
  `is_online` tinyint(1) DEFAULT 0,
  `status` enum('active','blocked') DEFAULT 'active',
  `approval_status` enum('pending','approved','rejected','partial_rejected','resume') DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by` bigint(20) DEFAULT NULL,
  `min_withdrawal` decimal(10,2) DEFAULT 500.00,
  `about` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_seen` datetime DEFAULT NULL,
  `registration_step` tinyint(4) DEFAULT 1,
  `registration_completed` tinyint(1) DEFAULT 0,
  `draft_saved_at` datetime DEFAULT current_timestamp(),
  `live_status` enum('online','offline','busy') DEFAULT 'offline',
  `last_register_step_at` datetime DEFAULT current_timestamp(),
  `device_id` varchar(255) DEFAULT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `step1_status` enum('pending','approved','rejected') DEFAULT NULL,
  `step2_status` enum('pending','approved','rejected') DEFAULT NULL,
  `step3_status` enum('pending','approved','rejected') DEFAULT NULL,
  `step4_status` enum('pending','approved','rejected') DEFAULT NULL,
  `step5_status` enum('pending','approved','rejected') DEFAULT NULL,
  `step1_remark` text DEFAULT NULL,
  `step2_remark` text DEFAULT NULL,
  `step3_remark` text DEFAULT NULL,
  `step4_remark` text DEFAULT NULL,
  `step5_remark` text DEFAULT NULL,
  `next_review_date` date DEFAULT NULL,
  `validity_date` date DEFAULT NULL,
  `referral_code` varchar(20) DEFAULT NULL,
  `referred_by` bigint(20) DEFAULT NULL,
  `referral_bonus_earned` decimal(12,2) DEFAULT 0.00,
  `total_referrals` int(11) DEFAULT 0,
  `active_referrals` int(11) DEFAULT 0,
  `resubmitted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `astrologers`
--

INSERT INTO `astrologers` (`id`, `uuid`, `name`, `email`, `phone`, `password`, `fcm_token`, `device_type`, `gender`, `dob`, `display_name`, `profile_image`, `experience`, `rating`, `total_reviews`, `total_sessions`, `total_chats`, `total_audio`, `total_video`, `total_chat_minutes`, `total_audio_minutes`, `total_video_minutes`, `total_earnings`, `wallet_balance`, `commission_percent`, `education`, `education_cert`, `astro_cert`, `id_proof`, `address_proof`, `bank_name`, `account_number`, `ifsc_code`, `account_holder`, `upi_id`, `languages`, `expertise`, `chat_charge`, `audio_charge`, `video_charge`, `is_online`, `status`, `approval_status`, `rejection_reason`, `approved_at`, `approved_by`, `min_withdrawal`, `about`, `created_at`, `updated_at`, `last_seen`, `registration_step`, `registration_completed`, `draft_saved_at`, `live_status`, `last_register_step_at`, `device_id`, `branch_name`, `step1_status`, `step2_status`, `step3_status`, `step4_status`, `step5_status`, `step1_remark`, `step2_remark`, `step3_remark`, `step4_remark`, `step5_remark`, `next_review_date`, `validity_date`, `referral_code`, `referred_by`, `referral_bonus_earned`, `total_referrals`, `active_referrals`, `resubmitted`) VALUES
(60, 'd2db3f38-5583-4989-8fee-b1a7a9f4ed07', 'Aman', NULL, '7458946942', NULL, 'eejuyCybQqWUZhzBI3BNE8:APA91bELWvajv4DOYr1IJ9zNZlI8iS-8DFizOBXaijjJZzaGpj7T1nTEv2W7Y8i1gQypfk6dQLgZ66VAVByrru9aiMdU4IKF6zHgUA7vQNrnG2THIqofkoc', NULL, 'Male', '1990-06-14', NULL, '1782885328036-scaled_15587.jpg', '3-5 Years', 5.0, 1, 20, 18, 2, 0, 0, 4, 0, 160.00, 160.00, 20.00, 'Graduate', '1782885357706-scaled_15940.jpg', '1782885357716-scaled_15940.jpg', '1782885357407-scaled_15940.jpg', '1782885357558-scaled_15940.jpg', 'State Bank of India', '123456789', 'SBIN0011231', 'Aman', 'sbi@oksbi', 'Hindi,English,Bengali', 'Kundli Astrology,Tarot Reading,Face Reading,Vedic Astrology', 30.00, 50.00, 80.00, 1, 'active', 'approved', NULL, '2026-07-01 11:28:26', 1, 500.00, 'I\'m the astrologer from Kashi', '2026-07-01 05:55:28', '2026-07-22 09:21:49', NULL, 5, 1, '2026-07-01 05:55:28', 'online', '2026-07-01 05:55:28', NULL, 'MASKANWA BAZAR', 'approved', 'approved', 'approved', 'approved', 'approved', NULL, NULL, NULL, NULL, NULL, '2027-01-01', '2027-07-01', 'ASTRO526V1', NULL, 0.00, 0, 0, 0),
(61, '85f505c7-42f4-42bb-a064-5d22bb72bb68', 'Test Astrologer', NULL, '9876543210', NULL, 'ew58ss-DSjuvJ6mMCzKqHC:APA91bEn3MZO6EPx3VhgrldNwiYBu79E_9M0BmzYsEIn6yKsiNKma9rsf45ag4RxmqdzBrHrWNztLOLvIFyWplbbxcNLST0I8NBmAwi67kvGygkehap_cXQ', NULL, 'Male', '1990-06-15', NULL, '1782889709385-scaled_5335.jpg', '3-5 Years', 0.0, 0, 23, 14, 4, 5, 3, 4, 2, 552.00, 552.00, 20.00, 'Graduate', '1782889749616-scaled_15900.png', '1782889749708-scaled_15900.png', '1782889748908-scaled_15900.png', '1782889749468-scaled_15900.png', 'State Bank of India', '123456789', 'SBIN0011231', 'Test Astrologer', 'sbi@oksbi', 'Hindi,English', 'Kundli Astrology,Tarot Reading,Vedic Astrology', 30.00, 50.00, 80.00, 1, 'active', 'approved', NULL, '2026-07-01 12:49:36', 1, 500.00, 'I the astrologer from Kashi', '2026-07-01 07:08:30', '2026-07-21 17:43:58', NULL, 5, 1, '2026-07-01 07:08:30', 'online', '2026-07-01 07:08:30', NULL, 'MASKANWA BAZAR', 'approved', 'approved', 'approved', 'approved', 'approved', NULL, NULL, NULL, NULL, NULL, '2027-01-01', '2027-07-01', 'ASTROKFXY0', NULL, 400.00, 2, 2, 0),
(65, 'd4a25357-575b-4daa-a7b3-ae15798c4269', 'Kamlesh', NULL, '9452205977', NULL, 'ez-l6eb6SGqJ-CRUnVVmIp:APA91bEFP8R8lkaINy0kYMhakKBAPtBGBZIul5clM9Mz_torVKHMoGJTHwuz1twPhKh1BGtM3rT8OyGN3mUC1iqmsl4ay_szXomI9bQYeczCXNyisvawOFM', NULL, 'Male', '1990-06-15', NULL, '1784656580621-image_cropper_1784656488326.jpg', '3-5 Years', 5.0, 1, 3, 1, 1, 1, 0, 1, 1, 104.00, 104.00, 20.00, 'Graduate', '1784656628814-image_cropper_1784656619322.jpg', '1784656628848-image_cropper_1784656624886.jpg', '1784656628731-image_cropper_1784656607759.jpg', '1784656628777-image_cropper_1784656613964.jpg', 'State Bank of India', '123456789', 'SBIN0001234', 'Kamlesh', '', 'Hindi,English', 'Kundli Astrology,Tarot Reading,Vedic Astrology,Vastu Shastra,Numerology', 30.00, 50.00, 80.00, 1, 'active', 'approved', NULL, '2026-07-21 23:29:06', 1, 500.00, 'I\'m a good astrologer I have many years of experience in astrology don\'t hesitate just ask me what ever you want 😊', '2026-07-21 17:56:20', '2026-07-21 18:00:44', NULL, 5, 1, '2026-07-21 23:26:20', 'online', '2026-07-21 23:26:20', NULL, 'HAJIGANJ', 'approved', 'approved', 'approved', 'approved', 'approved', NULL, NULL, NULL, NULL, NULL, '2027-01-21', '2027-07-21', 'ASTROI0APY', NULL, 0.00, 0, 0, 0),
(66, 'c31abf7e-f7cd-439e-806a-187cfd7a7498', 'Ashu', NULL, '9565922753', NULL, 'fLRk7_LHQRKuNXKqDCS_se:APA91bFxtpZbvyEtB3S_CVumfsBtlcFbfLCliEfMVgWffnwUUd0IjbCICcn5K-u7-MpOFVgtkEvl5-pcVP1lGgtC3E94nn-P-Ory5YsuBOSKTM1be2NqFxk', NULL, 'Male', '1990-06-15', NULL, '1784782071746-scaled_IMG-20260715-WA0018.jpg', '3-5 Years', 0.0, 0, 1, 0, 1, 0, 0, 1, 0, 40.00, 40.00, 20.00, 'Graduate', NULL, NULL, '1784712405926-image_cropper_1784712397272.jpg', '1784712406116-image_cropper_1784712403061.jpg', 'State Bank of India', '1234567890', 'SBIN0000123', 'Ashutosh Tripathi', '', 'Hindi,English', 'Kundli Astrology,Vedic Astrology,Tarot Reading,Vastu Shastra,Numerology,Palmistry,Lal Kitab', 20.00, 50.00, 80.00, 1, 'active', 'approved', NULL, '2026-07-22 15:00:39', 1, 500.00, 'Experienced in astrology connect to demonstrate your future', '2026-07-22 09:26:23', '2026-07-23 04:52:09', NULL, 3, 1, '2026-07-22 14:56:23', 'online', '2026-07-22 14:56:23', NULL, 'KURSEONG', 'approved', 'approved', 'approved', 'approved', 'approved', NULL, NULL, NULL, NULL, NULL, '2027-01-22', '2027-07-22', 'ASTROS4FW0', NULL, 0.00, 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `astrologer_expertise`
--

CREATE TABLE `astrologer_expertise` (
  `id` bigint(20) NOT NULL,
  `astrologer_id` bigint(20) DEFAULT NULL,
  `expertise_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `astrologer_languages`
--

CREATE TABLE `astrologer_languages` (
  `id` bigint(20) NOT NULL,
  `astrologer_id` bigint(20) NOT NULL,
  `language` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `astrologer_reviews`
--

CREATE TABLE `astrologer_reviews` (
  `id` bigint(20) NOT NULL,
  `astrologer_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `booking_type` enum('chat','audio','video') NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `comment` text DEFAULT NULL,
  `status` enum('published','private') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `astrologer_reviews`
--

INSERT INTO `astrologer_reviews` (`id`, `astrologer_id`, `user_id`, `booking_type`, `rating`, `comment`, `status`, `created_at`, `updated_at`) VALUES
(16, 60, 25, 'chat', 5, 'accha h \n', 'published', '2026-07-01 06:20:25', '2026-07-01 06:20:25'),
(17, 65, 26, 'video', 5, 'Very good astrologer ', 'published', '2026-07-21 18:00:44', '2026-07-21 18:00:44');

-- --------------------------------------------------------

--
-- Table structure for table `astrologer_withdrawals`
--

CREATE TABLE `astrologer_withdrawals` (
  `id` bigint(20) NOT NULL,
  `astrologer_id` bigint(20) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(20) DEFAULT 'bank_transfer',
  `utr_number` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `rejection_note` text DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_at` datetime DEFAULT NULL,
  `processed_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `redirect_url` varchar(255) DEFAULT NULL,
  `type` enum('home','offer','popup') DEFAULT 'home',
  `status` enum('active','inactive') DEFAULT 'active',
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `description`, `image`, `redirect_url`, `type`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Welcome Banner', NULL, 'https://getmeupadvertising.in/images/Book-Astrology-Ad-in-Newspaper.jpg', 'https://astrovani.com/offer', 'home', 'active', 1, '2026-05-23 07:37:58', '2026-06-17 19:25:52'),
(2, 'Welcome Banner 2', NULL, 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/of-templates-flyer-poster-astrology-event-design-334f2cee0f3ac936224dad7d6f0b58f9_screen.jpg?ts=1650121049', 'https://astrovani.com/offer', 'home', 'active', 1, '2026-05-23 07:37:58', '2026-06-04 06:31:40'),
(3, 'Welcome Banner 2', NULL, 'https://content.vinaybajrangi.com/img/content/1739361077-banners-936-337-Muhurat-Meaning-and-Benefits-in-Astrology.jpg', 'https://astrovani.com/offer', 'home', 'active', 1, '2026-05-23 07:37:58', '2026-06-04 06:31:40');

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `id` int(11) NOT NULL,
  `blocker_type` enum('user','astrologer') NOT NULL,
  `blocker_user_id` int(11) DEFAULT NULL,
  `blocker_astrologer_id` int(11) DEFAULT NULL,
  `blocked_user_id` int(11) DEFAULT NULL,
  `blocked_astrologer_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `blocks`
--

INSERT INTO `blocks` (`id`, `blocker_type`, `blocker_user_id`, `blocker_astrologer_id`, `blocked_user_id`, `blocked_astrologer_id`, `created_at`) VALUES
(7, 'astrologer', NULL, 61, 28, NULL, '2026-07-18 14:03:42');

-- --------------------------------------------------------

--
-- Table structure for table `call_history`
--

CREATE TABLE `call_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Customer user id',
  `agent_id` int(11) NOT NULL COMMENT 'Consultant / agent id',
  `channel_name` varchar(100) DEFAULT NULL,
  `call_type` enum('video','audio') NOT NULL COMMENT 'Call type',
  `duration` int(11) DEFAULT 0 COMMENT 'Call duration in seconds',
  `bonus_time` int(20) DEFAULT 0,
  `amount` decimal(10,2) DEFAULT 0.00 COMMENT 'Call earning amount',
  `status` enum('initiate','connecting','ringing','unanswered','answered','hangup','decline','disconnect') NOT NULL DEFAULT 'initiate',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'Call time',
  `start_time` bigint(20) DEFAULT NULL,
  `end_time` bigint(20) DEFAULT NULL,
  `per_minute_charge` double DEFAULT NULL,
  `admin_commission_percent` double DEFAULT NULL,
  `call_long_duration` varchar(20) DEFAULT NULL,
  `disconnect_reason` varchar(255) DEFAULT NULL,
  `user_rating` tinyint(1) DEFAULT NULL,
  `user_review` text DEFAULT NULL,
  `recording_url` varchar(255) DEFAULT NULL,
  `user_ip` varchar(50) DEFAULT NULL,
  `app_version` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='Voice & video call history';

--
-- Dumping data for table `call_history`
--

INSERT INTO `call_history` (`id`, `user_id`, `agent_id`, `channel_name`, `call_type`, `duration`, `bonus_time`, `amount`, `status`, `created_at`, `start_time`, `end_time`, `per_minute_charge`, `admin_commission_percent`, `call_long_duration`, `disconnect_reason`, `user_rating`, `user_review`, `recording_url`, `user_ip`, `app_version`) VALUES
(812, 25, 60, 'call_25_60_1782887150325', 'audio', 108, 0, 100.00, 'hangup', '2026-07-01 06:25:50', 1782887150, 1782887258, 50, 20, NULL, 'astrologer_ended', NULL, NULL, NULL, NULL, NULL),
(813, 25, 60, 'call_25_60_1782887277584', 'audio', 90, 0, 100.00, 'hangup', '2026-07-01 06:27:57', 1782887277, 1782887367, 50, 20, NULL, 'user_ended', NULL, NULL, NULL, NULL, NULL),
(814, 28, 60, 'call_28_60_1784349578911', 'audio', 0, 0, 0.00, 'unanswered', '2026-07-18 04:39:38', 1784349578, NULL, 0, 0, NULL, 'user_cancelled', NULL, NULL, NULL, NULL, NULL),
(815, 28, 61, 'call_28_61_1784349589335', 'audio', 18, 0, 50.00, 'hangup', '2026-07-18 04:39:49', 1784349589, 1784349607, 50, 20, NULL, 'user_ended', NULL, NULL, NULL, NULL, NULL),
(816, 28, 61, 'call_28_61_1784349621623', 'audio', 9, 0, 50.00, 'hangup', '2026-07-18 04:40:21', 1784349621, 1784349630, 50, 20, NULL, 'astrologer_ended', NULL, NULL, NULL, NULL, NULL),
(817, 28, 61, 'call_28_61_1784349680707', 'audio', 6, 0, 50.00, 'hangup', '2026-07-18 04:41:20', 1784349680, 1784349686, 50, 20, NULL, 'user_ended', NULL, NULL, NULL, NULL, NULL),
(818, 28, 61, 'call_28_61_1784349698656', 'video', 0, 0, 160.00, 'unanswered', '2026-07-18 04:41:38', 1784349698, NULL, 80, 20, NULL, 'user_cancelled', NULL, NULL, NULL, NULL, NULL),
(819, 28, 61, 'call_28_61_1784349723756', 'audio', 0, 0, 0.00, 'unanswered', '2026-07-18 04:42:03', 1784349723, NULL, 0, 0, NULL, 'user_cancelled', NULL, NULL, NULL, NULL, NULL),
(820, 28, 61, 'call_28_61_1784349731945', 'video', 0, 0, 80.00, 'unanswered', '2026-07-18 04:42:11', 1784349731, NULL, 80, 20, NULL, 'user_cancelled', NULL, NULL, NULL, NULL, NULL),
(821, 28, 61, 'call_28_61_1784349818065', 'video', 21, 0, 80.00, 'hangup', '2026-07-18 04:43:38', 1784349818, 1784349839, 80, 20, NULL, 'astrologer_ended', NULL, NULL, NULL, NULL, NULL),
(822, 26, 61, 'call_26_61_1784655786988', 'audio', 38, 0, 50.00, 'hangup', '2026-07-21 17:43:06', 1784655786, 1784655824, 50, 20, NULL, 'user_ended', NULL, NULL, NULL, NULL, NULL),
(823, 26, 61, 'call_26_61_1784655831239', 'video', 7, 0, 80.00, 'hangup', '2026-07-21 17:43:51', 1784655831, 1784655838, 80, 20, NULL, 'user_ended', NULL, NULL, NULL, NULL, NULL),
(824, 26, 65, 'call_26_65_1784656806066', 'audio', 6, 0, 50.00, 'hangup', '2026-07-21 18:00:06', 1784656806, 1784656812, 50, 20, NULL, 'user_ended', NULL, NULL, NULL, NULL, NULL),
(825, 26, 65, 'call_26_65_1784656823278', 'video', 6, 0, 80.00, 'hangup', '2026-07-21 18:00:23', 1784656823, 1784656829, 80, 20, NULL, 'user_ended', NULL, NULL, NULL, NULL, NULL),
(826, 31, 66, 'call_31_66_1784712731319', 'audio', 23, 0, 50.00, 'hangup', '2026-07-22 09:32:11', 1784712731, 1784712754, 50, 20, NULL, 'astrologer_ended', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_conversations`
--

CREATE TABLE `chat_conversations` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(100) DEFAULT NULL,
  `conversation_id` varchar(50) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `astrologer_id` bigint(20) NOT NULL,
  `status` enum('active','ended','blocked') DEFAULT 'active',
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ended_at` timestamp NULL DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT NULL,
  `is_user_online` tinyint(1) DEFAULT 0,
  `is_astrologer_online` tinyint(1) DEFAULT 0,
  `total_messages` int(11) DEFAULT 0,
  `amount` decimal(10,2) DEFAULT 0.00,
  `duration` int(11) DEFAULT 0,
  `charge_per_min` decimal(10,2) DEFAULT 0.00,
  `admin_commission` decimal(5,2) DEFAULT 20.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `family_member_id` bigint(20) DEFAULT NULL,
  `is_timer_running` tinyint(1) DEFAULT 0,
  `disconnect_reason` varchar(255) DEFAULT NULL,
  `user_rating` tinyint(1) DEFAULT NULL,
  `user_review` text DEFAULT NULL,
  `last_message` text DEFAULT NULL,
  `booking_type` enum('self','member') DEFAULT 'self',
  `member_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_conversations`
--

INSERT INTO `chat_conversations` (`id`, `uuid`, `conversation_id`, `user_id`, `astrologer_id`, `status`, `started_at`, `ended_at`, `last_message_at`, `is_user_online`, `is_astrologer_online`, `total_messages`, `amount`, `duration`, `charge_per_min`, `admin_commission`, `created_at`, `updated_at`, `family_member_id`, `is_timer_running`, `disconnect_reason`, `user_rating`, `user_review`, `last_message`, `booking_type`, `member_id`) VALUES
(337, '1fdd4cc8-8849-4c82-8968-164d990e37b8', '25_60_1782886586884', 25, 60, 'ended', '2026-07-01 06:16:26', '2026-07-01 06:17:30', '2026-07-01 06:16:53', 0, 1, 1, 0.00, 0, 30.00, 20.00, '2026-07-01 06:16:26', '2026-07-01 06:17:58', NULL, 0, NULL, NULL, NULL, 'hi', 'member', 19),
(338, 'ba12d770-c7bd-43f1-87b4-7d92531d1a03', '25_60_1782886694499', 25, 60, 'ended', '2026-07-01 06:18:14', '2026-07-01 06:18:45', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-01 06:18:14', '2026-07-01 06:18:45', NULL, 0, NULL, NULL, NULL, NULL, 'self', 25),
(339, '20e0696e-b211-4b12-9f3f-65a3754bc266', '25_60_1782886730830', 25, 60, 'ended', '2026-07-01 06:18:50', '2026-07-01 06:19:13', '2026-07-01 06:18:54', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-01 06:18:50', '2026-07-01 06:19:36', NULL, 0, NULL, NULL, NULL, 'hhj', 'self', 25),
(340, 'b711e01d-c884-4d81-bb8e-dedb850f4c03', '25_60_1782886962939', 25, 60, 'ended', '2026-07-01 06:22:42', '2026-07-01 06:22:46', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-01 06:22:42', '2026-07-01 06:22:46', NULL, 0, NULL, NULL, NULL, NULL, 'self', 25),
(341, '0160f4e6-b190-4f19-a6be-d2c68f7bdf80', '25_60_1782887112012', 25, 60, 'ended', '2026-07-01 06:25:12', '2026-07-01 06:25:14', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-01 06:25:12', '2026-07-01 06:25:14', NULL, 0, NULL, NULL, NULL, NULL, 'self', 25),
(342, '00c7841f-849b-4f44-8100-60d832cece11', '26_61_1783398937528', 26, 61, 'ended', '2026-07-07 04:35:37', '2026-07-07 04:36:29', '2026-07-07 04:35:42', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-07 04:35:37', '2026-07-07 04:36:29', NULL, 0, NULL, NULL, NULL, 'hii', 'self', 26),
(343, '4b28d774-0ab6-4a65-8e85-2a2d603ec164', '26_61_1783399005076', 26, 61, 'ended', '2026-07-07 04:36:45', '2026-07-07 04:36:49', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-07 04:36:45', '2026-07-07 04:36:49', NULL, 0, NULL, NULL, NULL, NULL, 'self', 26),
(344, 'ae938dde-d433-407f-ae18-47d6983d6509', '26_61_1783399018377', 26, 61, 'ended', '2026-07-07 04:36:58', '2026-07-07 04:37:06', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-07 04:36:58', '2026-07-07 04:37:06', NULL, 0, NULL, NULL, NULL, NULL, 'self', 26),
(345, '8d88e33c-874a-4d8e-b87d-4ee2a9b71fc8', '26_61_1783399055152', 26, 61, 'ended', '2026-07-07 04:37:35', '2026-07-07 04:37:47', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-07 04:37:35', '2026-07-07 04:37:47', NULL, 0, NULL, NULL, NULL, NULL, 'self', 26),
(346, 'e35d1928-bec6-47ef-863c-060d9dcae2f8', '26_60_1783401838181', 26, 60, 'ended', '2026-07-07 05:23:58', '2026-07-07 05:24:07', '2026-07-07 05:24:02', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-07 05:23:58', '2026-07-07 05:24:07', NULL, 0, NULL, NULL, NULL, 'jii', 'self', 26),
(347, '44fbaed0-802f-441f-ae85-26d09470f046', '26_60_1783420480510', 26, 60, 'ended', '2026-07-07 10:34:40', '2026-07-07 10:35:52', '2026-07-07 10:35:49', 0, 0, 2, 0.00, 0, 30.00, 20.00, '2026-07-07 10:34:40', '2026-07-07 10:35:52', NULL, 0, NULL, NULL, NULL, '📷 Photo', 'self', 26),
(348, '4a7e08bb-14b8-4375-b742-caf5f41d871e', '26_60_1783481754417', 26, 60, 'ended', '2026-07-08 03:35:54', '2026-07-08 03:36:38', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-08 03:35:54', '2026-07-08 03:36:38', NULL, 0, NULL, NULL, NULL, NULL, 'self', 26),
(349, 'd3a823fc-44d8-42bb-9cd7-8b8bdb241bd2', '28_60_1784348872596', 28, 60, 'ended', '2026-07-18 04:27:52', '2026-07-18 04:28:33', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 04:27:52', '2026-07-18 04:28:33', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(350, '3e5120f6-fa2c-49b5-9d36-a0e23696bec9', '28_60_1784348971095', 28, 60, 'ended', '2026-07-18 04:29:31', '2026-07-18 04:30:43', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 04:29:31', '2026-07-18 04:30:43', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(351, '4e010ecf-3d04-4c0c-94c2-4ab119938413', '28_60_1784349149859', 28, 60, 'ended', '2026-07-18 04:32:29', '2026-07-18 04:32:39', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 04:32:29', '2026-07-18 04:32:39', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(352, 'a186165d-ea86-46c6-a720-e5841589b3af', '28_60_1784349390849', 28, 60, 'ended', '2026-07-18 04:36:30', '2026-07-18 04:36:35', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 04:36:30', '2026-07-18 04:36:35', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(353, '602b28f3-84a4-455c-881b-bd0a89ab351f', '28_60_1784350616851', 28, 60, 'ended', '2026-07-18 04:56:56', '2026-07-18 04:57:03', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 04:56:56', '2026-07-18 04:57:03', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(354, 'eccb4449-0f3b-4cb7-b4fe-394f645c3bef', '28_60_1784350709258', 28, 60, 'ended', '2026-07-18 04:58:29', '2026-07-18 04:58:35', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 04:58:29', '2026-07-18 04:58:35', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(355, 'b7d4c354-078a-49c7-8c00-996a9d0bcb30', '28_60_1784350970406', 28, 60, 'ended', '2026-07-18 05:02:50', '2026-07-18 05:02:55', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 05:02:50', '2026-07-18 05:02:55', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(356, 'e2d5c2a2-1feb-4b8e-ab44-ee6f2888190a', '28_60_1784353925354', 28, 60, 'ended', '2026-07-18 05:52:05', '2026-07-18 05:52:10', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 05:52:05', '2026-07-18 05:52:10', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(357, 'a7319d1e-247d-4c16-a151-29b5308a3a14', '28_60_1784355623954', 28, 60, 'ended', '2026-07-18 06:20:23', '2026-07-18 06:21:39', '2026-07-18 06:21:21', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-18 06:20:23', '2026-07-18 06:21:39', NULL, 0, NULL, NULL, NULL, 'hii', 'self', 28),
(358, 'fbff6cf6-6bc0-46a8-bb2a-1e3afa21ba37', '28_61_1784355703034', 28, 61, 'ended', '2026-07-18 06:21:43', '2026-07-18 06:22:03', '2026-07-18 06:21:54', 0, 0, 2, 30.00, 1, 30.00, 20.00, '2026-07-18 06:21:43', '2026-07-18 06:22:03', NULL, 0, NULL, NULL, NULL, 'hii', 'self', 28),
(359, '091f63a7-0d3c-4187-ab7f-18747204f2be', '28_61_1784355807014', 28, 61, 'ended', '2026-07-18 06:23:27', '2026-07-18 06:23:41', '2026-07-18 06:23:33', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-18 06:23:27', '2026-07-18 06:23:41', NULL, 0, NULL, NULL, NULL, 'hii', 'self', 28),
(360, '9c7f2bad-1acf-406d-92b0-9653e0cccaed', '28_61_1784358100814', 28, 61, 'ended', '2026-07-18 07:01:40', '2026-07-18 07:01:46', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 07:01:40', '2026-07-18 07:01:46', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(361, '78237ded-7924-4dc3-bd74-296b84773390', '28_61_1784358214374', 28, 61, 'ended', '2026-07-18 07:03:34', '2026-07-18 07:03:44', '2026-07-18 07:03:37', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-18 07:03:34', '2026-07-18 07:03:44', NULL, 0, NULL, NULL, NULL, 'hii', 'self', 28),
(362, '1cc1c33c-ba8a-4cec-b88b-19cb099fca25', '28_61_1784358903970', 28, 61, 'ended', '2026-07-18 07:15:03', '2026-07-18 07:15:19', '2026-07-18 07:15:15', 0, 0, 2, 30.00, 1, 30.00, 20.00, '2026-07-18 07:15:03', '2026-07-18 07:48:27', NULL, 0, NULL, NULL, NULL, 'hello', 'self', 28),
(363, '742512dd-166b-49ab-8434-feda47a314c4', '28_61_1784360888252', 28, 61, 'ended', '2026-07-18 07:48:08', '2026-07-18 07:48:56', '2026-07-18 07:48:51', 0, 1, 3, 30.00, 1, 30.00, 20.00, '2026-07-18 07:48:08', '2026-07-18 07:54:07', NULL, 0, NULL, NULL, NULL, 'ji', 'self', 28),
(364, 'f0d9e0da-e675-4c6e-b82e-9bcf89410562', '28_61_1784362115973', 28, 61, 'active', '2026-07-18 08:08:35', NULL, NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 08:08:35', '2026-07-18 08:08:35', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(365, '3f429119-2968-448d-806e-6ab4c816aa3c', '28_61_1784363582439', 28, 61, 'ended', '2026-07-18 08:33:02', '2026-07-18 08:33:17', '2026-07-18 08:33:09', 0, 1, 1, 0.00, 0, 30.00, 20.00, '2026-07-18 08:33:02', '2026-07-18 08:33:17', NULL, 0, NULL, NULL, NULL, 'hii', 'self', 28),
(366, '9c07677f-b93f-46d2-ba78-89de17968f73', '28_61_1784363606438', 28, 61, 'ended', '2026-07-18 08:33:26', '2026-07-18 08:33:41', '2026-07-18 08:33:30', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-18 08:33:26', '2026-07-18 08:33:41', NULL, 0, NULL, NULL, NULL, 'kiii', 'self', 28),
(367, '56422c81-ca8e-40b3-9ac8-66cc5a1686aa', '28_60_1784365677542', 28, 60, 'ended', '2026-07-18 09:07:57', '2026-07-18 09:08:01', NULL, 0, 0, 0, 0.00, 0, 30.00, 20.00, '2026-07-18 09:07:57', '2026-07-18 09:08:01', NULL, 0, NULL, NULL, NULL, NULL, 'self', 28),
(368, '5bec57a8-9cba-418d-8988-e9df95388430', '26_61_1784655774382', 26, 61, 'ended', '2026-07-21 17:42:54', '2026-07-21 17:43:02', '2026-07-21 17:42:57', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-21 17:42:54', '2026-07-21 17:44:34', NULL, 0, NULL, NULL, NULL, 'hii', 'self', 26),
(369, 'd72c7a68-6690-4514-812f-933d6063641a', '26_65_1784656797713', 26, 65, 'ended', '2026-07-21 17:59:57', '2026-07-21 18:00:03', '2026-07-21 18:00:00', 0, 0, 1, 0.00, 0, 30.00, 20.00, '2026-07-21 17:59:57', '2026-07-21 18:00:03', NULL, 0, NULL, NULL, NULL, 'hii', 'self', 26);

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(100) DEFAULT NULL,
  `conversation_id` varchar(100) DEFAULT NULL,
  `sender_type` enum('user','astrologer') NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `message` text DEFAULT NULL,
  `message_type` enum('text','image','file') DEFAULT 'text',
  `file_url` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `uuid`, `conversation_id`, `sender_type`, `sender_id`, `message`, `message_type`, `file_url`, `is_read`, `is_deleted`, `sent_at`) VALUES
(658, '3ddb71e7-dee2-4f81-b7f8-bfc51f8bcde1', '25_60_1782886586884', 'user', 25, 'hi', 'text', NULL, 1, 0, '2026-07-01 06:16:53'),
(659, 'e53709a0-0165-4686-aa74-eb44d81433a1', '25_60_1782886730830', 'user', 25, 'hhj', 'text', NULL, 1, 0, '2026-07-01 06:18:54'),
(660, 'b8fece1f-f61d-45be-afa8-39d51235239b', '26_61_1783398937528', 'user', 26, 'hii', 'text', NULL, 1, 0, '2026-07-07 04:35:42'),
(661, 'e8e7a712-33bd-46cb-aa37-67b57bf683bc', '26_60_1783401838181', 'user', 26, 'jii', 'text', NULL, 0, 0, '2026-07-07 05:24:02'),
(662, 'ca7c1e41-bf09-4425-beec-d0bab1c54350', '26_60_1783420480510', 'user', 26, NULL, 'image', '1783420486291-scaled_1000038262.jpg', 0, 0, '2026-07-07 10:34:46'),
(663, 'b4c6e27d-da57-4180-a64f-85e01d616059', '26_60_1783420480510', 'user', 26, NULL, 'image', '1783420549425-scaled_3031ad4d-9933-4d5d-b369-40414ee3fae12862264955134732288.jpg', 0, 0, '2026-07-07 10:35:49'),
(664, 'cdd24292-8039-45b4-99d1-076d84671291', '28_60_1784355623954', 'user', 28, 'hii', 'text', NULL, 0, 0, '2026-07-18 06:21:21'),
(665, '2fd044b3-4a17-42b1-9251-8a23d947fd35', '28_61_1784355703034', 'user', 28, 'hii', 'text', NULL, 1, 0, '2026-07-18 06:21:46'),
(666, '5927903e-d319-4b04-a68c-c1342e3908df', '28_61_1784355703034', 'astrologer', 61, 'hii', 'text', NULL, 0, 0, '2026-07-18 06:21:54'),
(667, '36f23634-acdc-4754-9a0a-7b8081344943', '28_61_1784355807014', 'user', 28, 'hii', 'text', NULL, 1, 0, '2026-07-18 06:23:33'),
(668, '1b6b5d59-1a07-45ff-906b-12aecb5b2c3c', '28_61_1784358214374', 'user', 28, 'hii', 'text', NULL, 1, 0, '2026-07-18 07:03:37'),
(669, 'e5f8e691-8595-4733-b94a-5c52f231bbdb', '28_61_1784358903970', 'user', 28, 'hii', 'text', NULL, 1, 0, '2026-07-18 07:15:07'),
(670, 'ee568e47-4108-4ff6-9ad2-68521114e541', '28_61_1784358903970', 'astrologer', 61, 'hello', 'text', NULL, 1, 0, '2026-07-18 07:15:15'),
(671, '39658064-4e56-4862-9778-7c35fd0ea041', '28_61_1784360888252', 'user', 28, 'hi', 'text', NULL, 1, 0, '2026-07-18 07:48:38'),
(672, 'ccd491f6-d19f-4e4f-ba8a-8c773dd6acd2', '28_61_1784360888252', 'user', 28, 'okk', 'text', NULL, 1, 0, '2026-07-18 07:48:42'),
(673, '310182a2-8bc6-4ca3-a327-ec0d546915b1', '28_61_1784360888252', 'astrologer', 61, 'ji', 'text', NULL, 1, 0, '2026-07-18 07:48:51'),
(674, '8b3c5dce-851f-4203-a9ed-c41c636b9931', '28_61_1784363582439', 'user', 28, 'hii', 'text', NULL, 1, 0, '2026-07-18 08:33:09'),
(675, '764bffb5-ea7f-4d67-b820-5bb92e3a1e7c', '28_61_1784363606438', 'user', 28, 'kiii', 'text', NULL, 1, 0, '2026-07-18 08:33:30'),
(676, 'ccdf1052-e6c1-4d61-9ddb-407c9e86b87f', '26_61_1784655774382', 'user', 26, 'hii', 'text', NULL, 1, 0, '2026-07-21 17:42:57'),
(677, '7bdead3c-d8f9-4b69-8405-c3c4d792d7f6', '26_65_1784656797713', 'user', 26, 'hii', 'text', NULL, 0, 0, '2026-07-21 18:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `expertise_master`
--

CREATE TABLE `expertise_master` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expertise_master`
--

INSERT INTO `expertise_master` (`id`, `name`, `image`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Kundli Astrology', 'KundliAstrology.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:08:36'),
(2, 'Vedic Astrology', 'VedicAstrology.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:07:26'),
(3, 'Tarot Reading', 'TarotReading.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:06:27'),
(4, 'Vastu Shastra', 'VastuShastra.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:06:53'),
(5, 'Numerology', 'Numerology.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:05:09'),
(6, 'Palmistry', 'Palmistry.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:05:29'),
(7, 'Face Reading', 'FaceReading.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:07:59'),
(8, 'Lal Kitab', 'LalKitab.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:08:58'),
(9, 'Gemology', 'Gemology.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:08:13'),
(10, 'Reiki Healing', 'ReikiHealing.png', 1, 0, '2026-05-29 06:46:06', '2026-06-14 21:06:13'),
(11, 'Feng Shui', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(12, 'Horoscope Reading', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(13, 'Match Making', '1781949624737-ChatGPT Image May 25, 2026, 11_13_38 AM (1) copy 7.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:00:24'),
(14, 'Nadi Astrology', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(15, 'KP Astrology', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(16, 'Prashna Kundli', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(17, 'Psychic Reading', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(18, 'Angel Reading', '1781949943794-ChatGPT Image May 25, 2026, 11_05_40 AM copy 7.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:05:44'),
(19, 'Crystal Healing', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(20, 'Spiritual Healing', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(21, 'Mantra Healing', '1781949771754-ChatGPT Image May 25, 2026, 11_07_26 AM copy 2.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:02:51'),
(22, 'Yantra Consultation', '1781949803979-ChatGPT Image May 25, 2026, 11_07_26 AM copy 4.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:03:24'),
(23, 'Chakra Healing', '1781949824656-ChatGPT Image May 25, 2026, 11_07_26 AM copy 6.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:03:44'),
(24, 'Aura Reading', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(25, 'Astrology Remedies', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(26, 'Black Magic Removal', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(27, 'Past Life Reading', '1781949885644-ChatGPT Image May 25, 2026, 11_07_26 AM copy 5.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:04:45'),
(28, 'Signature Analysis', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(29, 'Dream Analysis', '1781944435238-ChatGPT Image May 25, 2026, 11_07_26 AM copy 8.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 08:35:00'),
(30, 'Lo Shu Grid', '1781949737207-ChatGPT Image May 25, 2026, 11_07_26 AM copy.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:02:17'),
(31, 'Switchwords Consultation', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(32, 'Pendulum Dowsing', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(33, 'Coffee Cup Reading', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(34, 'Tea Leaf Reading', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(35, 'Muhurat Consultation', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(36, 'Birth Chart Analysis', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(37, 'Career Astrology', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(38, 'Love & Relationship Guidance', '1781949700778-ChatGPT Image May 25, 2026, 11_08_27 AM copy 7.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:01:40'),
(39, 'Health Astrology', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(40, 'Finance Astrology', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(41, 'Palm Healing', '1781949297488-ChatGPT Image May 25, 2026, 11_04_56 AM (1) copy 3.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 09:56:55'),
(42, 'Energy Healing', '1781949404832-ChatGPT Image May 25, 2026, 11_05_40 AM.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:05:56'),
(43, 'Meditation Guidance', '1781949467940-ChatGPT Image May 25, 2026, 11_05_40 AM.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 09:57:48'),
(44, 'Rudraksha Consultation', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(45, 'Gemstone Consultation', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(46, 'Vaastu Remedies', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(47, 'Planetary Dosha Solution', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(48, 'Navgraha Consultation', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(49, 'Pitra Dosh Solution', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(50, 'Mangal Dosh Consultation', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(51, 'Kundli Matching', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(52, 'Child Astrology', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(53, 'Marriage Astrology', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(54, 'Business Astrology', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(55, 'Naamkaran Consultation', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(56, 'Spiritual Coaching', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(57, 'Life Path Guidance', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(58, 'Horoscope Prediction', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(59, 'Daily Horoscope', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(60, 'Weekly Horoscope', NULL, 1, 0, '2026-05-29 06:46:06', '2026-05-29 06:46:06'),
(61, 'Monthly Horoscope', '1781949648914-ChatGPT Image May 25, 2026, 11_13_38 AM (1) copy 5.png', 1, 0, '2026-05-29 06:46:06', '2026-06-20 10:00:49'),
(62, 'Prashna Kundali', NULL, 1, 8, '2026-05-29 06:46:06', '2026-05-29 06:46:06');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `astrologer_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `astrologer_id`, `created_at`) VALUES
(12, 25, 60, '2026-07-01 06:19:48');

-- --------------------------------------------------------

--
-- Table structure for table `gift_amounts`
--

CREATE TABLE `gift_amounts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gift_amounts`
--

INSERT INTO `gift_amounts` (`id`, `name`, `amount`, `image`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(2, '10 coins', 10.00, 'gift_1782454068440.png', 1, 0, '2026-06-26 06:07:48', '2026-06-27 09:44:12'),
(3, '50 coins', 50.00, 'gift_1782454102888.png', 1, 1, '2026-06-26 06:08:23', '2026-06-27 09:49:21'),
(4, '100 coins', 100.00, 'gift_1782454128550.png', 1, 2, '2026-06-26 06:08:48', '2026-06-27 09:49:28'),
(5, '200 coins', 200.00, 'gift_1782454160895.png', 1, 3, '2026-06-26 06:09:21', '2026-06-27 09:49:41'),
(6, '500 coins', 500.00, 'gift_1782454185065.png', 1, 4, '2026-06-26 06:09:45', '2026-06-27 09:49:48'),
(7, '1000 coins', 1000.00, 'gift_1782454199400.png', 1, 5, '2026-06-26 06:09:59', '2026-06-27 09:49:56');

-- --------------------------------------------------------

--
-- Table structure for table `horoscopes`
--

CREATE TABLE `horoscopes` (
  `id` bigint(20) NOT NULL,
  `zodiac_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `type` enum('daily','weekly','monthly','yearly') DEFAULT NULL,
  `lucky_number` varchar(10) DEFAULT NULL,
  `lucky_color` varchar(50) DEFAULT NULL,
  `lucky_time` varchar(50) DEFAULT NULL,
  `love` text DEFAULT NULL,
  `career` text DEFAULT NULL,
  `money` text DEFAULT NULL,
  `health` text DEFAULT NULL,
  `personal_growth` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `family` text DEFAULT NULL,
  `education` text DEFAULT NULL,
  `travel` text DEFAULT NULL,
  `overview` text DEFAULT NULL,
  `lucky_direction` varchar(100) DEFAULT NULL,
  `tip_of_the_day` text DEFAULT NULL,
  `love_status` varchar(50) DEFAULT NULL,
  `career_status` varchar(50) DEFAULT NULL,
  `health_status` varchar(50) DEFAULT NULL,
  `finance_status` varchar(50) DEFAULT NULL,
  `personal_growth_status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `horoscopes`
--

INSERT INTO `horoscopes` (`id`, `zodiac_id`, `date`, `type`, `lucky_number`, `lucky_color`, `lucky_time`, `love`, `career`, `money`, `health`, `personal_growth`, `created_at`, `family`, `education`, `travel`, `overview`, `lucky_direction`, `tip_of_the_day`, `love_status`, `career_status`, `health_status`, `finance_status`, `personal_growth_status`) VALUES
(114, 1, '2026-06-16', 'monthly', '8', 'Blue', '4:00 PM - 6:00 PM', 'Love life mein aap thode emotional ups and downs experience kar sakte hain, especially agar aap single hain to new connections aayenge. Existing relationships mein open communication se misunderstandings door ho sakti hain. Patience aur empathy se aap apne partner ke saath deeper bond create kar sakte hain.', 'Career front par aapko naye responsibilities mil sakte hain jo aapki leadership skills ko test karenge. Team ke saath collaboration improve hoga, lekin time management par focus karna hoga. Promotions ya salary hike ke signs hain, bas apne goals ko clearly define karein.', 'Finance side par aapko extra income ka source mil sakta hai, shayad freelance ya side project ke through. However, impulsive purchases se bachne ki zarurat hai, budget banaye rakhna zaroori hai. Savings aur investments par dhyan dene se long term stability aayegi.', 'Health ke mamle mein aapko thodi fatigue feel ho sakti hai, isliye proper sleep schedule maintain karein. Regular exercise, especially cardio, aapko energetic rakhega. Diet mein fresh fruits aur vegetables shamil karein, processed food se bachne ki koshish karein.', 'Personal growth ke liye meditation aur self-reflection ka routine adopt karein, isse mental clarity milegi. New skills ya hobbies explore karna aapko confidence dega. Apne comfort zone se bahar nikal kar challenges accept karna aapko aur strong banayega.', '2026-06-16 12:25:43', 'Family ke saath communication improve hogi, aur aapko unka emotional support milta rahega. Kuch minor disputes ho sakte hain, lekin patience se unhe resolve kiya ja sakta hai. Family gatherings aur traditions ko celebrate karna aapke bonding ko aur strong karega.', 'Education ya learning ke field mein aapko new courses ya certifications ka opportunity mil sakti hai. Focused study routine se aap exams ya projects me accha perform karenge. Peer group se collaboration se learning experience aur enriching ho jayega.', 'Travel plans thode delayed ho sakte hain, lekin short trips ya weekend getaways aapko refresh karenge. Planning mein details par dhyan dena zaroori hai, especially safety measures. Travel se aapko new perspectives milenge jo personal growth me help karega.', 'Mesh rashi ke liye ye mahina kaafi dynamic rahega, jabki Mars aur Mercury ki conjunction aapke mental agility ko boost karegi. Aapko naye projects mil sakte hain jo aapki creativity ko highlight karenge, lekin deadlines ka pressure bhi feel hoga. Relationships mein thodi misunderstanding ho sakti hai, par communication se sab theek ho jayega. Health ke mamle mein, diet par dhyan dena zaroori hai, especially oily foods se bachna. Financial side par unexpected income aane ka chance hai, lekin unnecessary spending se bache. Family ke saath samay bitane se emotional bonding strong hogi, aur aapko unka support milta rahega. Overall, ye mahina growth aur self-awareness ka hai, bas patience aur positivity banaye rakhe.', 'North', 'Har subah gratitude ka ek moment lo aur positive affirmations repeat karo. Consistency se hi aap apni potential ko fully unlock kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(115, 2, '2026-06-16', 'monthly', '5', 'Silver', '4:00 PM - 6:00 PM', 'Prem sambandhon me aapko emotional clarity milegi, aur partner ke saath communication smooth rahegi. Single Vrishabh native ko kaafi social gatherings me interesting prospects mil sakte hain, lekin jaldi decision na lein. Existing relationships me thoda patience rakhna zaroori hai, taki misunderstandings ko avoid kiya ja sake.', 'Is mahine aapke professional life me growth ka achha mauka hai, naye projects aapko challenge karenge aur aapki capabilities ko highlight karenge. Team work aur leadership skills ka istemal karke aap senior management ka dhyan khinch sakte hain. Agar aap self-employment ya freelance ka soch rahe hain, to ye samay uske liye conducive hai, lekin planning ko miss na karein.', 'Aapke income streams stable hain, lekin kuch unexpected kharch aane ki sambhavna hai, isliye emergency fund ready rakhein. Investment me aapko moderate returns mil sakte hain, especially in mutual funds or real estate. Budgeting aur expense tracking se aap financial stability ko maintain kar sakte hain.', 'Physical stamina achha rahega, lekin aapko regular exercise routine follow karna chahiye, especially cardio aur yoga. Digestive issues se bachne ke liye spicy food se door rahen aur balanced diet lein. Stress management ke liye meditation ya deep breathing exercises bahut faydemand rahenge.', 'Is mahine self-reflection aur inner development par focus karna beneficial hoga, meditation aur journaling se aap apne goals ko clear kar sakte hain. New skills seekhne ka mauka aayega, especially digital tools aur communication. Apni comfort zone se bahar nikal kar challenges accept karna aapko confidence dega.', '2026-06-16 12:25:43', 'Family members ke saath quality time spend karne se emotional bonding aur strong hogi, especially parents ke saath. Bacche aapki guidance me academics ya hobbies me achha perform karenge, unki encouragement zaroori hai. Old relatives se milne ya unki help karne se aapko mental satisfaction milegi.', 'Students ke liye focus and concentration high rahegi, isse exam preparation me fayda hoga. New learning modules ya certifications ke liye perfect time hai, especially creative fields. Teachers aur mentors se milne wale guidance se aapke academic goals clear honge.', 'Short trips ya weekend getaways aapko refresh karenge, especially nature spots ya hill stations. Business travel me smooth coordination rahega, lekin travel documents check karna na bhoolen. Long distance travel planning me thoda extra time allocate karein, taki sab kuch hassle-free ho.', 'Vrishabh rashi ke log is mahine bahut hi dynamic energy ka anubhav karenge, jisse unki personal aur professional life dono hi sudharenge. Shukra aur Mangal ki yog se aapke relationships mein nayi spark aayegi, lekin dhairya bana ke rakhna zaroori hai. Career mein aapke hard work ka phal milne wala hai, aur promotions ya new projects ke chances bright hain. Financial front par aapko kuch unexpected expenses dekhne ko mil sakte hain, lekin smart budgeting se sab manage ho jayega. Health wise, aapko apni diet aur exercise routine par dhyan dena hoga, varna fatigue aane ka risk hai. Family ke saath samay bitane se emotional bonding strong hogi, aur aapke bachche bhi aapki guidance me accha perform karenge. Overall, ye mahina aapke liye growth aur stability ka perfect blend lekar aaya hai, bas positivity ko apna mantra banaye rakhein.', 'North-West', 'Apni mehnat ko consistency ke saath aage badhayein, har chhoti jeet ko celebrate karein. Positive mindset se har challenge ko opportunity mein badal sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(116, 3, '2026-06-16', 'monthly', '7', 'Pink', '7:00 AM - 9:00 AM', 'Love life mein aapko emotional ups and downs ka experience ho sakta hai, especially agar aap single hain toh new connections aane ki sambhavna hai. Existing relationships mein communication gap ho sakta hai, isliye apne partner se khul kar baat karein. Trust aur understanding ko strengthen karne se aapka bond aur bhi solid hoga.', 'Career sector mein aapko naye projects mil sakte hain jo aapki creativity ko showcase karenge. Teamwork aur leadership skills ka istemal karke aap senior management ki nazar mein aayenge. Lekin, deadlines ko meet karne ke liye time management par dhyan dena zaroori hai, varna stress ka level badh sakta hai.', 'Finance sector mein aapko extra income ka chance mil sakta hai, lekin impulsive spending se bachein. Short term investments par dhyan dene se aapko stable returns mil sakte hain. Budget banakar expenses ko track karna financial stability ko maintain karega.', 'Health ke mamle mein aapko immunity boost karne ke liye vitamin C aur regular walk ka routine adopt karna chahiye. Stress management ke liye meditation ya yoga ki practice faydemand hogi. Overwork se bachne ke liye proper sleep schedule maintain karna bahut zaroori hai.', 'Personal growth ke liye aapko self‑reflection aur mindfulness ki practice karni chahiye. New hobbies ya skill development se aapki confidence level increase hogi. Apne goals ko likh kar unke liye daily action steps set karna aapko focused rakhega.', '2026-06-16 12:25:44', 'Family ke saath samay bitane se aapke relationships strong honge, especially parents ke saath emotional bonding ka mauka milega. Kuch minor disputes ho sakte hain, lekin patience aur empathy se unhe asani se solve kiya ja sakta hai. Family gatherings aur celebrations aapke mood ko uplift karenge.', 'Education ya learning ke field mein aapko new courses ya certifications ke liye opportunities mil sakti hain. Focused study schedule aur regular revision se aap exams ya projects mein accha performance denge. Mentors ya seniors se guidance lene se aapki understanding deep hogi.', 'Travel plans aane wale hafte me materialize ho sakte hain, lekin last minute changes ka dhyan rakhein. Short trips se aapko mental refreshment milega, jo kaam me productivity badhayega. Safety measures aur travel insurance ko ignore na karein, especially long journeys ke liye.', 'Mithun rashi ke log is mahine apni zindagi mein kai naye opportunities ka samna karenge, jo aapko personal aur professional dono level par grow karne ka mauka denge. Mercury ka transit aapke communication skills ko boost karega, isliye meetings aur presentations mein aapka impact strong hoga. Social circles mein aapki popularity badhegi, lekin emotional balance banaye rakhna zaroori hai, warna stress ho sakta hai. Health front par aapko regular exercise aur balanced diet ka dhyan rakhna hoga, varna fatigue feel ho sakta hai. Financial matters mein aapko cautious approach rakhni chahiye, especially investments ke decisions mein patience zaroori hai. Family ke saath samay bitane se emotional bonding mazboot hogi, lekin kuch misunderstandings ho sakti hain, jise patience se handle karein. Overall, yeh mahina aapke liye growth aur self‑realization ka hai, bas positive mindset aur disciplined routine se hi aap isse fully benefit kar paenge.', 'East', 'Har subah apne din ka ek positive affirmation likhein aur uspar vishwas rakhein. Consistency aur self‑belief se aap koi bhi challenge asani se paar kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(117, 4, '2026-06-16', 'monthly', '6', 'Golden', '6:00 PM - 8:00 PM', 'Love life me emotional depth badhegi, aur aap apne partner ke saath zyada samajhdari se baat karenge. Single Cancer logon ke liye koi special connection ban sakta hai, bas apni instincts par trust karein. Thodi jealousy ya possessiveness ko control me rakhe, taki misunderstandings se bacha ja sake.', 'Career ke mamle me aapko naye projects milne ki sambhavna hai, jo aapki leadership qualities ko ubhar kar dikhayenge. Saturn ki supportive aspect se aapki mehnat ka phal milne ki ummeed hai, lekin deadlines ko ignore na karein. Teamwork me thoda patience rakhe, kyunki kuch log aapke ideas ko turant accept nahi karenge.', 'Finance sector me aapko kuch unexpected expenses aa sakte hain, isliye budgeting pe dhyan dein. Investments me short term gains ki jagah long term stability par focus karein, kyunki market volatility aapko affect kar sakti hai. Savings ko boost karne ke liye unnecessary luxuries se door rahen, aur emergency fund ko mazboot banayein.', 'Health ke mamle me aapko daily routine me thoda exercise include karna chahiye, especially brisk walking ya swimming. Digestive issues thode samay ke liye ho sakte hain, isliye diet me light aur balanced foods lein. Stress ko manage karne ke liye meditation ya pranayama daily practice karein, tabhi aap energetic feel karenge.', 'Personal growth ke liye aapko apne inner self ko explore karna hoga, journaling ya self-help books se fayda hoga. Meditation aur mindfulness aapko mental clarity denge, jo aapke decisions ko sharper banayenge. New hobbies ya creative pursuits aapke confidence ko boost karenge, isliye try karne se mat daren.', '2026-06-16 12:25:44', 'Family relationships me aapko thodi patience dikhani padegi, especially elder members ke saath. Unke concerns ko dhyan se sunna aur unka support dena aapke liye beneficial hoga. Kuch family matters me misunderstandings ho sakte hain, lekin open communication se sab theek ho jayega.', 'Education ya skill upgradation ke liye yeh mahina favorable hai, aapko online courses ya workshops me interest badhega. Concentration thodi fluctuate kar sakti hai, isliye study schedule ko realistic rakhein. Exams ya project deadlines ke liye proper planning se aap achhe results achieve karenge.', 'Travel plans me aapko short trips ya weekend getaways ka sujhav mil sakta hai, jo aapke mood ko fresh karenge. Long distance travel me safety measures ka dhyan rakhe, especially health protocols. Travel se related financial planning pe bhi nazar rakhen, taki unexpected costs se bacha ja sake.', 'Cancer sign ke logon ke liye yeh mahina kaafi dynamic hoga, emotions aur responsibilities ka ek accha mel dekhne ko milega. Moon ki strong influence se aapko intuition ka boost milega, jo decisions ko sahaj bana degi. Family aur professional life dono mein aapko naye challenges milenge, lekin aapki adaptability aapko aage le jayegi. Financial side par thoda caution zaroori hai, especially impulsive spending se bachein. Health me aapko stress management par focus karna hoga, yoga ya meditation aapke liye faydemand sabit ho sakta hai. Relationships me deeper bonding ka mauka aayega, lekin communication me clarity zaroori hai. Overall, yeh mahina aapko growth aur self-awareness ka ek achha platform dega.', 'South-East', 'Apni intuition ko follow karo, lekin har decision me thoda logic bhi jodna mat bhoolna. Har roz thoda sa gratitude practice karo, yeh aapke din ko positivity se bhar dega.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(118, 5, '2026-06-16', 'monthly', '1', 'Purple', '6:00 AM - 8:00 AM', 'Single Singh rashi ke liye social gatherings mein interesting connections ban sakte hain, jo long term relationships mein evolve ho sakte hain. Existing couples ke liye communication ka level high rahega, isliye misunderstandings ko turant resolve karna asaan hoga. Emotional intimacy ko nurture karne ke liye surprise dates aur heartfelt gestures ka sahara lein.', 'Is mahine aapke professional life mein kuch nayi responsibilities aayengi jo aapke leadership skills ko test karengi. Team projects mein aapka input valuable rahega aur promotion ka chance bhi ho sakta hai. Lekin deadlines ko meet karne ke liye time management par dhyan dena zaroori hai.', 'Aapke income sources stable hain, lekin unnecessary shopping se savings par impact pad sakta hai. Investments ko diversify karna aur emergency fund ko strong banana is mahine ka smart move hai. Short term expenses ko track karne se financial peace mil sakti hai.', 'Physical stamina improve ho rahi hai, lekin aapko overexertion se bachna chahiye, especially evenings mein. Digestive health ko maintain karne ke liye light meals aur herbal teas beneficial honge. Mindfulness meditation se stress levels kam honge aur mental clarity barhegi.', 'Self-reflection aur journaling aapko apne goals ko realign karne mein madad karegi. New hobbies jaise painting ya yoga aapke inner peace ko enhance karenge. Spiritual practices par dhyan dene se intuition strong hogi aur decisions aapko sahi direction dikhayenge.', '2026-06-16 12:25:44', 'Family members ke saath open conversations se old issues resolve honge aur bonding deep hogi. Parents ki health ko leke aapko thoda extra care dena padega, especially diet par dhyan dena. Younger siblings ke liye aapka guidance unki academic ya career choices mein valuable hoga.', 'Students ke liye focus level high rahega, lekin procrastination ka trap avoid karna zaroori hai. Exams aur projects ke liye systematic study plan banana success ko guarantee karega. Teachers ke feedback ko positively lein, kyunki yeh aapke improvement ke liye crucial hai.', 'Short trips ya weekend getaways aapke mental refreshment ke liye perfect rahenge. Travel plans ko early book karne se cost savings aur better accommodation mil sakti hai. Long distance travel ke liye health precautions, especially hydration, ka dhyan rakhein.', 'Singh rashi ke log is mahine apni inner strength ko jagrit karenge aur naye opportunities ke liye taiyar honge. Moon ka transit aapke emotional balance ko support karta hai, isliye aapko apne relationships mein clarity mil sakti hai. Career field mein aapko kuch unexpected projects mil sakte hain jo aapki creativity ko boost karenge. Financially, aapko disciplined budgeting se long term gains milenge, lekin impulsive spending se bachna zaroori hai. Health side par, regular exercise aur balanced diet aapko energetic rakhegi. Family ke saath samay bitane se emotional bonding strong hogi aur misunderstandings door hongi. Overall, yeh mahina aapko growth, stability aur happiness ka balanced mix dega.', 'South-East', 'Apni har choti success ko celebrate karein, kyunki ye aapko bigger goals ki taraf motivate karti hai. Consistency aur positive attitude se aap har challenge ko aasani se paar kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(119, 6, '2026-06-16', 'monthly', '3', 'Green', '6:00 PM - 8:00 PM', 'Love life mein Venus ki positive vibes se aapka partner ke sath bonding stronger hogi, ya single logon ke liye new connections ban sakte hain. Emotional transparency aur small gestures se relationship mein warmth aayegi. Thoda patience rakhein, kyunki kuch misunderstandings ho sakti hain jo communication se solve ho jayengi.', 'Career front par Mercury ki influence se aapki communication aur reporting skills shine karengi, jis se promotions ya new projects milne ke chances badhenge. Detail-oriented kaam, research ya data analysis mein aapko extra confidence feel hoga. Lekin, deadlines ke pressure se bachne ke liye time management par extra dhyan dena hoga.', 'Finance sector mein steady income aayegi, lekin unnecessary shopping se bacha kar savings par focus karein. Short-term investments par thoda cautious approach rakhein, kyunki market volatility ho sakti hai. Budget planning se aap financial stability maintain kar payenge.', 'Health ke mamle mein, aapko digestive system par dhyan dena chahiye, kyunki Virgo ka ruling planet Mercury sometimes stomach issues cause kar sakta hai. Regular yoga aur light cardio se stress level kam hoga. Proper sleep schedule maintain karna zaroori hai, varna fatigue feel kar sakte hain.', 'Personal growth ke liye meditation aur self-reflection aapko inner clarity degi, jo aapko apne goals ko re-align karne mein help karegi. New skill learning ya online courses aapke confidence ko boost karenge. Consistency aur discipline se aap apni potential ko fully unlock kar sakte hain.', '2026-06-16 12:25:44', 'Family relationships mein aapko supportive environment mil raha hai, lekin elderly members ki health par thoda extra care dena hoga. Home responsibilities ko share karne se harmony bani rahegi. Small family gatherings emotional bonding ko aur strong banayenge.', 'Education ya learning ke liye aapka mind sharp hai, isliye complex subjects ya certifications ko tackle karna asaan rahega. Study groups aur peer discussions se concepts clear honge. Time table banane se aap procrastination se bach sakte hain.', 'Travel plans mein short trips ya weekend getaways aapko refresh karenge, lekin last-minute bookings se avoid karein. Safety measures aur travel insurance ko ignore na karein. New places explore karne se creative ideas milenge, jo aapke work ya personal projects mein help karenge.', 'Kanya rashi ke log is mahine apne daily routine mein kuch nayi energy feel karenge, jo unhe kaam aur personal life dono mein balance banane mein madad karegi. Mercury ki strong position se analytical skills aur attention to detail mein vriddhi hogi, jo aapko complex problems ko asani se solve karne mein help karegi. Is samay aapki intuition bhi strong hogi, isliye decisions lene se pehle apne gut feeling ko dhyan se sunna zaroori hai. Relationships mein thodi patience ki zarurat hogi, especially jab misunderstandings arise ho. Health perspective se, aapko regular exercise aur proper diet par dhyan dena hoga, varna stress aapke immunity ko affect kar sakta hai. Financial matters mein moderate growth dikhegi, lekin impulsive spending se bachna zaroori hai. Overall, yeh mahina aapke liye self-improvement aur disciplined approach ka time hai, jo long-term success ki foundation rakhega.', 'West', 'Har din thoda waqt apne aap se baat cheet ke liye nikaalein, ye aapko mental clarity dega. Consistency se choti choti habits banayein, success automatically follow karegi.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(120, 7, '2026-06-16', 'monthly', '6', 'Turquoise', '8:00 AM - 10:00 AM', 'Love life mein aapko apne partner ke saath deeper bonding ka mauka milega. Singles ko ek interesting networking event se potential partner mil sakta hai. Communication pe dhyan dena zaruri hai, otherwise misunderstandings ho sakte hain.', 'Career ke field mein aapko ek naye project ka opportunity mil sakta hai jo aapke skills ko showcase karega. Aapke hard work se recognition milega aur senior management aapko appreciate karega. Team collaboration mein bhi improvement hoga, jisse aapke ideas implement hone ke chances badhenge.', 'Finance ke area mein aapko ek extra income source mil sakta hai, par investment decisions ko carefully evaluate karein. Monthly expenses track karne ke liye budgeting tool use karein. Unexpected expenses ke liye emergency fund maintain karna smart rahega.', 'Health ke mamle mein aapko apne diet pe focus karna hoga, especially protein intake increase karna chahiye. Light exercise jaise yoga ya walking daily routine mein shamil karein. Stress levels ko manage karne ke liye meditation ki practices try karein.', 'Personal growth ke liye aapko self-reflection aur mindfulness practices adopt karni chahiye. Apne hobbies ko explore karne ka perfect samay hai, jaise painting ya music. Long-term goals ko revise karen aur realistic milestones set karen.', '2026-06-16 12:25:44', 'Family relationships mein bonding strengthen hogi, especially parents ke saath. Par aapko unki health aur emotional needs ko samajhna hoga. Family events me active participation se positive vibes milegi.', 'Education ke area mein aapko exams ya certifications ke liye extra effort lagana hoga. Study schedule ko structured banana zaruri hai, along with regular breaks. Mentors se guidance lena aapke performance ko improve karega.', 'Travel ke liye short weekend trips ka plan banaye, preferably nature destinations. Long haul trips ke liye budget planning pe dhyan den. Travel companions ke saath communication clear rakhna, otherwise misunderstandings ho sakte hain.', 'Tula rashi ke liye is mahine ka astrological forecast bahut positive hai, especially Jupiter ke samayik sankhya ke karan aapko apne vichar aur decision making mein clarity milegi. Aapki creative energies ko bhi boost milega, jisse aap artistic ya innovative projects mein success pa sakte hain. Lekin Dhyaan rahe ki Venus ke shifti prabhav ke karan kabhi kabhi aap apne relationships mein overthinking kar sakte hain. Mars ke influence se aapko thoda impatience feel hoga, isliye dhairya banaye rakhna zaruri hai. Aapko apne health routines mein thoda dhyan dena hoga, especially sleep pattern aur balanced diet pe. Financially, aapko ek unexpected opportunity mil sakti hai, par isko samajdari se handle karna hoga. Overall, yeh mahina aapke liye growth aur learning ka excellent period hai, provided you stay focused and balanced.', 'West', 'Aap apne goals ke liye daily affirmation practice karein. Remember, consistency is the key to success!', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(121, 8, '2026-06-16', 'monthly', '2', 'Orange', '6:00 AM - 8:00 AM', 'Love life mein aap ko apne partner ke saath emotional bonding ka unique opportunity milega. New relationships ke liye, aapki natural charm aur sincerity attract karegi. Apne feelings ko clearly express karne se misunderstandings avoid karenge.', 'Career mein aapko naye projects ka chance milega, especially in creative or analytical domains. Aapke hard work ko recognition milne ka high chance hai, lekin ek step back bhi ho sakta hai if you ignore small details. Networking events mein aapko valuable contacts mil sakte hain jo future mein aapke liye opening create karenge.', 'Financially, aapko savings aur investment options mein diversification ka mauka milega. Kuch unexpected expenses aapko face karne pad sakte hain, lekin overall aap stable rahenge. Budget planning se aap apne financial goals ko easily achieve kar sakte hain.', 'Health-wise, aapko moderate exercise se energy levels high rakhega. Thoda extra sleep aur balanced diet se aapko mental clarity milegi. Aapko ek small cold ya flu se bachne ke liye aapko vaccine aur hygiene pe dhyan dena chahiye.', 'Personal growth ke liye aapko self-discipline aur patience ki zaroorat hogi, especially when facing challenges. Aapko naye skills sikhne ka mauka milega, jo aapke confidence ko boost karega. Regular meditation se aapko inner peace aur focus milega, jo aapke daily tasks ko effectively manage karega.', '2026-06-16 12:25:44', 'Family ke saath aapko ek positive atmosphere milega, especially during gatherings. Parental guidance aapke decisions ko support karegi, especially in financial matters. Aapke siblings ke saath bhi aapko mutual respect ka environment milega, jo aapke relationships ko strengthen karega.', 'Education ke field mein aapko new courses aur certifications ke liye interest dikhega. Aapko study material ko organize karne ki zaroorat hogi, especially if you are juggling multiple subjects. With consistent effort, aap academic excellence achieve kar sakte hain, lekin aapko time management par focus karna hoga.', 'Travel ke liye aapko adventurous trips ka plan banana chahiye, especially if you love exploring new cultures. Aapko budget-friendly travel options ko consider karna chahiye, jo aapke financial stability ko maintain karenge. Family ke saath short trips aapko bonding aur relaxation ka perfect combination provide karenge.', 'Vrishchik rashi ke log is mahine apne aapko bohot energetic feel karenge, especially jab Mars aur Jupiter ki energy combine hogi. Aapke daily tasks ko handle karne ki capacity badhegi, lekin dhyan rahe ki aap apne personal relationships ko neglect mat karein. Financial decisions banane se pehle ek baar detail study karein, kyunki koi bhi impulsive step aapko future mein pareshani de sakta hai. Health-wise, aapko thoda extra stamina ki zaroorat padegi, especially if you are engaged in physically demanding activities. Career opportunities aapke saamne khulne lagenge, especially in fields related to technology or research. Love life mein, aapko apne partner ke saath deeper conversations ka mauka milega, jo aapke bond ko aur majboot karega. Personal growth ke liye aapko self-reflection aur meditation ka sahara lena chahiye, jo aapko inner peace provide karega. Family ke saath samay bitane se aapko emotional support milega, jo aapke overall well-being ke liye bahut faydemand hoga. Is mahine ki overall vibe ek balanced mix of ambition and compassion ka hai.', 'North-East', 'Har din apne goals ko clearly set karo aur unko achieve karne ke liye step-by-step plan banao. Positive mindset se aap apni potential ko maximum tak utilize kar sakte ho.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(122, 9, '2026-06-16', 'monthly', '2', 'Silver', '6:00 AM - 8:00 AM', 'Romantic relationships will feel more passionate and honest. Singles might meet someone who shares your values quickly. Existing partners will appreciate your open communication, strengthening the bond.', 'Job prospects mein aapko promotion ya naye responsibilities mil sakte hain, especially if you showcase initiative. Networking events and collaborations will open doors to significant projects. However, be cautious of overcommitting, as it may lead to burnout.', 'Financial gains are possible through wise investments and careful budgeting. Avoid impulsive spending; plan your expenses ahead. Monitoring market trends will help you make informed decisions.', 'Maintain a balanced diet and keep hydration in check to support your active lifestyle. Regular exercise can help manage stress and keep your energy levels steady. Pay attention to sleep patterns as irregular sleep might affect your overall well-being.', 'This month, introspection and self-awareness will guide you towards meaningful changes. Embrace new learning opportunities, such as online courses or workshops. Reflect on your personal goals to align your actions with your aspirations.', '2026-06-16 12:25:44', 'Family interactions will be warm and supportive, especially during gatherings. Address any misunderstandings promptly to maintain harmony. Show appreciation for your loved ones, strengthening emotional bonds.', 'Academic pursuits will benefit from focused study sessions and clear goals. Seek guidance from mentors or teachers to enhance understanding. Small breaks and relaxation techniques will improve concentration and retention.', 'Travel plans may bring excitement, especially if you explore new cultures. Plan itineraries in advance to avoid last-minute stress. Enjoy the journey while staying mindful of health and safety guidelines.', 'Dhanu rashi ke log is mahine apne instincts par bharosa kar sakte hain, kyunki Mars ki shakti aapki decision-making ko boost karegi. Aapke vichar zyada clear honge, especially jab aap kisi naye project ya idea ke saath deal kar rahe hon. Aapke relationships mein honesty se bharpur conversation hogi, jo aapko emotional stability dene mein madad karegi. Financial matters mein, aapki risk-taking attitude kabhi-kabhi rewarding ho sakti hai, lekin careful planning zaroori hai. Health ke taur par, apni energy levels ko monitor karna aur stress ko manage karna aapke liye essential hoga. Personal growth ki terms mein, aapko self-reflection aur learning ke liye time nikalna chahiye, kyunki isse aapko deeper insights milenge. Overall, is mahine aapko growth ke liye kaafi opportunities milengi, bas focus aur discipline ko maintain karna hoga.', 'North', 'Har din ek naya goal set karein aur usko achieve karne ke liye step-by-step plan banayein. Positive mindset se challenges ko opportunities mein badalne ka mauka milega.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(123, 10, '2026-06-16', 'monthly', '4', 'Turquoise', '10:00 AM - 12:00 PM', 'Love life mein aapko thoda emotional turbulence feel ho sakta hai, lekin communication se misunderstandings door ho jayenge. Single Makar rashi wale logon ko koi special person milne ki ashanka hai, bas apne social circle ko expand karein. Jo couples hain, unke liye mutual respect aur patience se relationship aur strong banegi.', 'Career ke mamle mein aapke projects ko ab recognition milne ka chance hai, especially agar aap apni creativity dikhayenge. Meetings aur presentations mein aapka confident approach aapko aage le jayega. Lekin, overworking se bachne ke liye proper work-life balance maintain karna zaroori hai.', 'Finance side par aapko thodi volatility dekhne ko mil sakti hai, isliye impulsive investments se bachen. Savings ko diversify karna aur emergency fund ko strong banae rakhna abhi zaroori hai. Extra income ke sources, jaise freelancing ya part-time projects, aapke liye beneficial ho sakte hain.', 'Health ke liye aapko regular exercise routine follow karna chahiye, especially brisk walking ya yoga. Seasonal allergies ka khatra ho sakta hai, isliye proper diet aur hydration maintain karein. Stress management techniques jaise meditation aapke mental well-being ko boost karenge.', 'Personal growth ke liye aapko self-reflection ka waqt nikalna chahiye, jo aapke inner goals ko clarify karega. New hobbies ya skill development, jaise digital marketing ya painting, aapki creativity ko unleash karenge. Meditation aur journaling aapko mental clarity denge, jo aapko aage badhne mein madad karega.', '2026-06-16 12:25:44', 'Family ke saath communication improve karna is mahine ka main focus hoga, choti choti baaton par bhi dhyan dena zaroori hai. Parents ya elders ki health par dhyan dena aur unki care mein actively involve hona beneficial rahega. Sibling relationships mein thodi rivalry ho sakti hai, lekin patience se sab resolve ho jayega.', 'Students ke liye yeh mahina important examinations aur projects ka hoga, isliye planning aur time management pe focus karein. Study groups join karne se concepts clear honge aur motivation bhi milegi. Exams ke pehle proper revision aur short breaks lena performance ko boost karega.', 'Travel plans mein aapko short trips ya weekend getaways ka mauka mil sakta hai, jo stress relief ke liye achha hoga. Business travel ke liye aapko extra preparation ki zaroorat padegi, lekin aapka confidence aapko safal banayega. Long distance travel se pehle health precautions aur travel insurance lena mat bhoolen.', 'Makar rashi ke logon ke liye yeh mahina kaafi dynamic rahega, jisme aapko kai naye opportunities mil sakti hain. Professional life mein aapki mehnat ka phal milne ki sambhavna hai, lekin dhairya aur discipline banae rakhna zaroori hai. Personal relationships mein thodi tension ho sakti hai, par samajhdari se baat cheet karke sab theek ho jayega. Health ke mamle mein aapko apni diet par dhyan dena hoga, especially seasonal fruits aur vegetables ka istemal badhayein. Finance side par kuch unexpected expenses aa sakte hain, isliye savings ka cushion banaye rakhna faydemand rahega. Family ke saath samay bitane se aapko emotional support milne ki ummeed hai, jo aapke decisions ko strong banayega. Overall, yeh mahina aapki growth ke liye ek stepping stone hai, bas proactive approach rakhein aur positivity ko apna mantra banayein.', 'North-East', 'Har subah gratitude ka ek moment nikaalein, isse positive energy aapke din ko shape karegi. Apne goals ko small steps mein divide karein, tabhi aap consistent progress dekh paenge.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(124, 11, '2026-06-16', 'monthly', '27', 'Red', '12:00 PM - 2:00 PM', 'Love life mein aapko emotional bonding ka deep level experience hoga. Single Aquarians ko koi special mil sakta hai jo intellectually compatible ho. Couples ko communication improve karna chahiye, taaki misunderstandings door ho sakein.', 'Career ke mamle mein aapko naye projects mil sakte hain jo aapki creativity ko showcase karenge. Senior colleagues ki appreciation aapko boost degi, lekin deadlines ko miss na karna zaroori hai. Networking events attend karne se aapke professional circle ka expansion hoga.', 'Finance sector mein aapko extra income ka source mil sakta hai, lekin unnecessary spending se bachein. Investments ko diversify karein, especially mutual funds aur gold. Credit card bills ko time pe clear karna aapki credit score ko protect karega.', 'Health ke liye aapko balanced diet aur regular exercise ki zarurat hai. Stress management techniques jaise meditation se aapki energy level stable rahegi. Cold ya flu ke chances ho sakte hain, isliye immunity boosters lein.', 'Personal growth ke liye aapko self-reflection aur journaling ki habit develop karni chahiye. Spiritual practices jaise mantra chanting aapke inner peace ko enhance karegi. New hobbies adopt karne se aapki creativity aur confidence dono badhegi.', '2026-06-16 12:25:44', 'Family ke saath aapka bond strong rahega, especially parents ke saath meaningful conversations. Siblings ke saath thodi tension ho sakti hai, lekin patience se sab theek ho jayega. Elder relatives ki health ko monitor karna zaroori hai, unki care mein aapka role important hoga.', 'Education mein students ko focus aur discipline ki zarurat hogi. Exams ke liye systematic study plan banana faydemand rahega. Online courses aur webinars se aapki knowledge base expand hogi, isliye naye topics explore karein.', 'Travel plans mein aapko short trips ka benefit mil sakta hai, jo aapko refresh karenge. Weekend getaways se mental stress kam hoga. Long distance travel ke liye proper planning aur safety measures follow karna zaroori hai.', 'Kumbh rashi ke logon ke liye yeh mahina mental clarity aur emotional balance ka time hai. Jupiter ki shukra ke saath yog se aapke relationships mein positivity aayegi. Career mein naye opportunities ka darwaza khul raha hai, lekin dhyan se planning zaroori hai. Financial sector mein thoda volatility dekhne ko mil sakti hai, isliye impulsive decisions se bachein. Health wise aapko apne routine mein yoga aur meditation ko include karna chahiye. Family members ke saath communication strong rahegi, lekin choti choti misunderstandings ho sakti hain, unhe calmly handle karein. Overall, aapka spiritual growth is mahine bahut strong hoga, isliye inner guidance ko follow karein.', 'South', 'Har din apne goals ko visualize karein, tabhi aapka confidence skyrocket hoga. Positive thoughts se aapke actions bhi aligned rahenge.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(125, 12, '2026-06-16', 'monthly', '5', 'Golden', '12:00 PM - 2:00 PM', 'Love life mein aapko apne partner ke sath deeper bonding banane ka chance milega. Agar single hain to koi event ya gathering aapko special someone se milne ka mauka de sakti hai. Emotional compatibility aapke relationship ko strong banayegi, lekin misunderstandings se bachne ke liye honest conversations zaruri hongi.', 'Is mahine aapko apne career goals ko clearly define karne ka mauka milega. Team projects mein aapke leadership skills ko spotlight mil sakta hai. However, kuch communication glitches bhi ho sakte hain, isliye dhyan se poochna aur samajhna zaruri hai.', 'Financial stability ke liye aapko apne expenses ko track karna hoga. Unexpected expenses create ho sakte hain, lekin smart budgeting se aap unhe cover kar sakte hain. Short-term investments par focus karna is mahine aapke liye faydemand rahega.', 'Health-wise, aapko energy levels mein ups and downs dekhne ko milenge. Regular physical activity aur light yoga sessions se aap apna balance maintain kar sakte hain. Kuch stress related issues ho sakte hain, isliye mindfulness practices jaise breathing exercises aapke liye beneficial honge.', 'Personal growth ke liye aapko apne fears aur doubts ko face karna hoga. Meditation aur journaling se aap apne thoughts ko clarify kar sakte hain. Creativity aur innovation ke liye new hobbies explore karna aapke liye beneficial hoga.', '2026-06-16 12:25:44', 'Family dynamics mein aapko patience aur understanding dikhani hogi, especially elder relatives ke sath. Weekend gatherings ya family meetings se bonding strong hogi. Shanti aur harmony maintain karne ke liye open communication key hogi.', 'Education ke field mein aapko knowledge ko deepen karne ka mauka milega. Online courses ya workshops se aap apni skill set enhance kar sakte hain. Group study sessions ya discussions se aapko fresh perspectives milenge, lekin time management pe focus karna zaruri hoga.', 'Travel ke liye aapko ek spontaneous trip plan karna chahiye, jahan aap cultural exposure le sakte hain. Budget-friendly destinations mein explore karna best rahega. Travel during off-season se aapko paisa bacha kar experience enjoy karne ka mauka milega.', 'Meen rashi ke log is mahine apne internal emotions ko samajhne mein kaafi samay denge, kyunki Mars ki sthiti se aapke liye shobha aur challenges dono saamne aayenge. Aapke liye ye mahina ek tarah ka emotional roller coaster hoga, jahan aapko apne instincts ko trust karna hoga. Career mein aapko naye opportunities mil sakti hain, lekin unhe pura karne ke liye aapko thoda patience rakhna hoga. Love life mein aapko apne partner ke sath communication ko strengthen karna hoga, especially agar aap single hain to koi meaningful connection banane ka mauka milega. Health-wise, dhyan rahe ki aapke energy levels fluctuate kar sakte hain, isliye consistent exercise aur balanced diet zaroori hai. Finance ke mamle mein aapko kuch unexpected expenses ka samna karna pad sakta hai, par budget planning se aap unhe handle kar sakte hain. Overall, Meen rashi ke liye ye mahina self-reflection aur growth ka perfect blend hai, jisse aap apni personal aur professional life mein balance la sakte hain.', 'North', 'Apni inner voice ko trust karo, aur daily positive affirmations se apne self-belief ko boost karo. Hard work ko balance karo relaxation ke sath, kyunki aapki energy hi aapki biggest asset hai.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(126, 1, '2026-06-16', 'daily', '5', 'Pink', '8:00 AM - 10:00 AM', 'Love life mein aaj aapko emotional clarity mil rahi hai, jis se aap apni feelings ko achhe se express kar sakte hain. Single Aries ko koi interesting person mil sakta hai, lekin patience rakhna zaroori hai. Committed relationships mein thoda space dena beneficial hoga, taaki bond aur strong ho sake.', 'Career front par aaj aapko naye projects mil sakte hain jo aapki leadership ko highlight karenge. Team ke saath collaboration smooth rahegi, lekin deadlines ko miss na karne ke liye time management pe dhyan dein. Agar aap job change ya promotion ki soch rahe hain, to aaj ka din favorable hai, bas clear communication rakhein.', 'Aaj financial decisions mein thoda caution zaroori hai, especially impulsive spending se bachein. Investment plans ko review karna sahi rahega, kyunki market thoda volatile ho sakta hai. Savings ko prioritize karne se aapko long term security milegi. ', 'Health sector mein aapka energy level high hai, isliye workout ya yoga ke liye best time hai. Dhyaan rahe ki aap apna diet balanced rakhein, junk food se doori banayein. Stress management ke liye meditation ya deep breathing exercises ka sahara lein, tabhi aap fully refreshed feel karenge.', 'Personal growth ke liye aaj self-reflection ka time nikaalein, apne goals ko rewrite karna beneficial hoga. New skill ya hobby start karne ka best time hai, kyunki aapki learning capacity high hai. Meditation aur journaling se aap apni inner voice ko sun sakte hain, jo aapko aage badhne mein help karega.', '2026-06-16 12:26:49', 'Family ke saath communication smooth rahegi, lekin kisi senior member ki health ko dhyan se dekhna hoga. Ghar ke chores share karne se harmony badhegi. Emotional support dene se aapke relationships aur strong honge.', 'Students ke liye aaj focus level high hai, isliye important topics ko revise karna beneficial rahega. Group study se concepts clear honge, lekin distractions se bachna hoga. Exams ke liye short breaks lena productivity ko boost karega.', 'Travel plans aaj thode delay ho sakte hain, isliye extra time buffer rakhein. Short trips ya local outings aapko refresh karenge, lekin long journeys ke liye proper planning zaroori hai. Safety measures follow karna aur documents ready rakhna important hai.', 'Aries ke liye aaj ka din kaafi dynamic hai, aapki urja ka level high hai aur nayi opportunities aapke saamne aayengi. Surya ki drishti aapke 1st house par padti hai, jis se aapko apne goals ko clear karne ka confidence milta hai. Mercury retrograde ke effects aaj thode communication glitches laa sakte hain, isliye dhairya se kaam lein. Shaani ki sthiti aapke relationships mein positivity laati hai, lekin impulsive decisions se bachaav zaroori hai. Mars ka influence aapke fitness routine ko boost karega, lekin overexertion se bachna hoga. Financial sector mein thoda volatility dekhne ko mil sakta hai, isliye planned spending hi best hai. Overall, aaj aapko balance bana kar chalna hoga, tabhi aap sab areas mein success dekh payenge.', 'East', 'Apni positivity ko banaye rakho, har challenge ko growth ka mauka samjho. Consistency aur patience se hi aap apne sapno ko haqiqat bana sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(127, 2, '2026-06-16', 'daily', '3', 'Purple', '8:00 AM - 10:00 AM', 'Aapke love life mein aaj shanti aur understanding ka atmosphere hai. Breakups ya conflicts ki wajah se tension feel ho sakta hai, so communication is key. Long-term partners ko mutual respect aur care ka chance milega.', 'Aapke career field mein aaj ek naye project ka opportunity mil sakta hai. Team collaboration se aapko significant progress milegi. Leadership traits ko dikhane ka perfect time hai, but avoid taking too much risk without proper research.', 'Finance wise aaj aapko ek small unexpected expense face karna pad sakta hai, but overall stability maintain hogi. Budget ko track karte hue savings ko maximize karne ki soch rakhein. Investments me cautious approach rakhein, high risk ventures avoid karein.', 'Aapke health ko maintain karne ke liye aaj proper sleep aur balanced diet maintain karna zaroori hai. Energy levels moderate raho, koi intense workout avoid karein. Small breaks aur relaxation techniques se overall wellbeing badhegi.', 'Aapko apne personal growth ke liye introspection aur reflection ka mauka milega. Self-discipline aur mindfulness practices aaj kaafi beneficial hongi. Aap apne creative side ko explore karne ke liye time nikaal sakte hain.', '2026-06-16 12:26:49', 'Family dynamics me aaj aapko supportive vibes mil sakti hain. Par kuch misunderstandings bhi ho sakti hain, so clear communication zaroori hai. Family ke saath quality time spend karne se emotional bond stronger hoga.', 'Study ke area me aapko focus aur clarity ki zaroorat hai. Complex topics ko break down karna helpful hoga. Group discussions ya study groups se aap better understanding pa sakte hain.', 'Travel plans me aaj aapko logistical challenges face karne pad sakte hain. Planning and early booking se aap stress-free experience enjoy kar sakte hain. Short domestic trips se relaxation aur recharge ka mauka milega.', 'Aaj ka din aapke liye kuch naye challenges lekar aata hai, lekin dhairy aur focus se aap unhe asaani se face kar sakte hain. Saturn ki prabhavshali position aapke saath rehti hai, isliye disciplined approach se kaam karein. Aapke emotions ka balance thoda high ho sakta hai, isliye apne decisions ko rational soch se guide karein. Aapka bhavishya is din ek positive direction mein ja raha hai, especially jab aap apni personal goals ko prioritize karenge. Samajik interactions mein aapko apne true self ko express karne ka mauka mil sakta hai. Aapke financial decisions bhi today strategic ho sakte hain, par overconfidence se bachen. Overall, aaj ka din aapke liye growth and learning ka platform hai, jaise ki aap apne past experiences ko ek new perspective se dekh sakte hain.', 'North-West', 'Har din apni routine me kuch naya add karke seekhein. Positive mindset se aap apne sapne ko realize kar sakte हैं.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent');
INSERT INTO `horoscopes` (`id`, `zodiac_id`, `date`, `type`, `lucky_number`, `lucky_color`, `lucky_time`, `love`, `career`, `money`, `health`, `personal_growth`, `created_at`, `family`, `education`, `travel`, `overview`, `lucky_direction`, `tip_of_the_day`, `love_status`, `career_status`, `health_status`, `finance_status`, `personal_growth_status`) VALUES
(128, 3, '2026-06-16', 'daily', '11', 'Golden', '7:00 AM - 9:00 AM', 'Love life mein aaj aap thode emotional ho sakte hain, lekin honest conversation se misunderstandings door ho jayengi. Single logon ko koi interesting person mil sakta hai jo intellectually connect kare. Couples ko patience rakhna hoga, small gestures se relationship strong banega.', 'Aaj aapke professional life mein kaafi opportunities aayengi, especially communication based roles mein. Meetings aur presentations mein aapki clarity aur confidence sabko impress karegi. Lekin, koi bhi hasty decision na lein, sabhi details ko verify karna zaruri hai.', 'Aaj financial matters mein thoda cautious approach rakhna zaruri hai, especially investments ke mamle mein. Unexpected expense aa sakta hai, lekin emergency fund se manage ho jayega. Savings par dhyan dein, long term goals ko dhyan mein rakhen.', 'Din ki shuruaat thodi hectic ho sakti hai, isliye morning walk ya stretching se body ko relax karen. Digestive system thoda sensitive ho sakta hai, isliye oily foods se bachen. Raat ko early sleep lein, taaki mind aur body dono refresh ho sakein.', 'Aaj aapko self‑reflection ka mauka milega, meditation ya journaling se aap apne inner thoughts ko samajh sakte hain. Learning new skill ya online course start karna beneficial hoga. Positive affirmations se confidence boost hoga.', '2026-06-16 12:26:49', 'Family members ke saath communication smooth rahega, lekin senior members ko thoda extra care dena zaruri hai. Ghar ke kaam mein aapki help se sabko relief milega. Emotional support dene se relationships aur strong honge.', 'Students ke liye aaj ka din focus aur concentration ka maang karta hai, especially important exams ke liye. Group study se concepts clear honge, lekin distractions se door rahen. Teachers ke suggestions ko dhyan se sunen, ye aapko fayda denge.', 'Travel plans mein aapko smooth journey mil sakti hai, lekin traffic ya delays ka chance bhi ho sakta hai, isliye extra time allocate karen. Short trips for relaxation will rejuvenate your mind. Safety measures ko follow karna na bhoolen, especially COVID protocols.', 'Mithun rashi ke liye aaj ka din kaafi dynamic rahega, jab aapko multiple responsibilities ka samna karna padega. Surya aur Mercury ki yog se aapki communication skills mein tezi aayegi, isliye meetings aur discussions mein aapko fayda hoga. Kintu, Moon ki weak position thodi emotional turbulence la sakti hai, isliye patience rakhein. Career mein aapko naye projects mil sakte hain jo aapki growth ko boost karenge. Financial decisions ko thoda soch samajh kar hi lein, kyunki impulsive spending se bacha ja sakta hai. Health wise, aapko thodi rest ki zarurat hogi, especially after a busy morning. Overall, aaj ka din aapko self‑discipline aur positivity se kaam lene ka mauka dega.', 'West', 'Apni har choti success ko celebrate karen, kyunki ye aapko aage badhne ki energy deti hai. Positive mindset se aaj ke challenges ko aasani se tackle kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(129, 4, '2026-06-16', 'daily', '11', 'Maroon', '6:00 PM - 8:00 PM', 'Romantic side par aaj aapko partner ke saath deeper emotional connection feel hoga, jo relationship ko strengthen karega. Single Cancer logon ko koi sincere person mil sakta hai, bas apni feelings ko openly express karein. Small misunderstandings ho sakte hain, lekin patience se unhe resolve karna aasaan hoga.', 'Aaj aapki professional life me focus aur discipline kaafi high rahega, jis se projects timely complete honge. Team ke saath coordination smooth hoga aur aapki leadership qualities ko appreciate kiya jayega. Agar koi new opportunity aati hai, to usko explore karne se aapke career me growth milegi.', 'Financial front par aaj kuch unexpected kharch aane ki sambhavna hai, lekin aapki cautious approach isko manage karegi. Investments me thoda patience rakhein, short term fluctuations ko ignore karein. Savings par dhyan dena aur unnecessary luxuries se door rehna faydemand rahega.', 'Aaj aapko apni diet par dhyan dena zaruri hai, especially oily foods se bachna. Light exercise jaise walk ya yoga aapke energy levels ko boost karega. Stress management ke liye deep breathing aur meditation ki practice aapko mental peace degi.', 'Aaj aapki introspection ki capacity high hai, isliye self-reflection ke liye samay nikaalein. New skill ya hobby shuru karne ka best din hai, jo aapko mental satisfaction dega. Journaling se aap apne emotions ko better understand kar sakte hain.', '2026-06-16 12:26:49', 'Family members ke saath aaj aapko supportive aur caring feel hoga, especially mata-pita ki baatein aapko emotional strength denge. Old conflicts ko resolve karne ka sahi samay hai, bas patience rakhein. Ghar ke environment ko harmonious banane ke liye small gestures kaam aayenge.', 'Students ke liye aaj ka din focus aur concentration ka hai, isse exams me accha performance milega. Study groups me discussions aapki understanding ko deepen karenge. New topics ko explore karne se aapki curiosity satisfy hogi.', 'Travel plans me aaj flexibility rakhna zaruri hai, kyunki kuch last minute changes ho sakte hain. Short trips ya day outings aapke mood ko fresh karenge. Safety measures jaise seatbelt aur mask ka dhyan rakhein, especially crowded places me.', 'Cancer rashi ke log aaj ka din emotional aur intuitive energy se bhara hua hai, jo aapko decisions mein clarity dega. Moon ka 6th house me position aapke daily routine par focus lane ki taraf ishara karta hai, isliye kaam ko systematic tareeke se handle karna faydemand rahega. Mercury ki transit aapke communication skills ko boost karegi, isliye meetings aur discussions mein aapka impact strong hoga. Aaj ka din aapko family ke saath emotional bonding ko strengthen karne ka mauka dega, especially mata-pita ke saath. Financial matters me kuch unexpected expense aa sakta hai, lekin aapki saving mindset isko easily manage kar degi. Health-wise, water intake aur proper diet aapke stamina ko maintain rakhegi, lekin stress se bachne ke liye meditation zaroori hai. Overall, aaj ka din growth aur self-awareness ka hai, bas positive mindset rakhein aur opportunities ko grab karen.', 'North', 'Apni positivity ko banaye rakho aur har choti jeet ko celebrate karo. Hard work aur patience se aaj ke challenges ko aasani se paar karo.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(130, 5, '2026-06-16', 'daily', '8', 'Golden', '8:00 AM - 10:00 AM', 'Romantic front par aaj thoda excitement hai, especially agar aap single hain to new connections ho sakti hain. Existing relationships mein deeper conversations ho sakti hain, jo bond ko strong banayegi. Thoda patience rakhein, jaldbazi mein decisions na lein.', 'Aaj aapke professional sphere mein extra energy ka flow hai, jo projects ko fast track karne mein madad karega. Meetings mein aapki ideas ko log appreciate karenge, lekin details par dhyan dena zaroori hai. Unexpected task aane par panic na karein, systematic approach se usse handle kar sakte hain.', 'Aaj financial decisions mein thoda caution rakhein, especially impulsive purchases se bachen. Investments ya big expenses ko postpone karna better hoga. Small gains ya freelance work se extra income ho sakti hai, isliye opportunities ko watch karein.', 'Physical stamina aaj achhi hai, lekin digestive system par dhyan dena zaroori hai, spicy food se bachain. Stress management ke liye short meditation ya yoga bahut faydemand hai. Raat ko proper sleep lein, taaki energy levels maintain rahein.', 'Self-development ke liye aaj ka din ideal hai, aapko new skill ya hobby explore karne ka mann kar sakta hai. Reading ya online course se knowledge boost hogi. Apne goals ko revisit karen aur realistic timeline set karen.', '2026-06-16 12:26:49', 'Parivaar ke sath communication smooth rahegi, lekin kuch choti misunderstandings ho sakti hain, unhe calmly address karein. Elder members ki health par dhyan dena zaroori hai. Family gatherings ya dinner se emotional bonding strong hogi.', 'Students ke liye aaj concentration level thoda fluctuate ho sakta hai, short breaks lete rahna madadgar rahega. Important exams ki preparation mein revision par focus karein. Group study ya discussion se concepts clear honge.', 'Travel plans mein aaj traffic ya delays ka chance hai, isliye extra time allocate karein. Short trips ya local outings aapko fresh perspective denge. Safety measures, especially masks aur sanitizers, maintain karna na bhoolen.', 'Aaj Singh rashi ke liye planetary alignment kaafi dynamic hai, jisse aapko naye opportunities mil sakte hain. Surya aur Mars ka conjunction aapke confidence ko boost karega, lekin Mercury retrograde thoda communication issues create kar sakta hai. Din ki shuruaat meditation ya short walk se karein, taaki mental clarity bani rahe. Kaam ke mamle mein aapko thoda patience rakhna padega, kyunki sab kuch turant nahi hoga. Raat ko dhyan dein ki aapka stress level high na ho, iske liye deep breathing exercises faydemand rahenge. Social media par aane wale messages ko lightly lein, sab kuch seriously na lein. Overall, aaj ka din aapke liye growth aur self-awareness ka hai, bas thoda balance bana ke rakhein.', 'South-West', 'Apne din ki shuruaat gratitude se karein, har choti success ko celebrate karein. Consistency aur positive mindset se aap sab hurdles ko easily cross kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(131, 6, '2026-06-16', 'daily', '5', 'Purple', '12:00 PM - 2:00 PM', 'रिश्तों में आज थोड़ा संवेदनशील माहौल रहेगा, इसलिए अपने साथी की भावनाओं को समझना जरूरी है। यदि आप एकल हैं, तो नया मिलन संभव है लेकिन धीरे-धीरे आगे बढ़ें। छोटे-छोटे इशारों से आप रिश्ते में गर्माहट ला सकते हैं।', 'आज कार्यस्थल पर नई जिम्मेदारियां मिल सकती हैं, जिससे आपके कौशल का परीक्षण होगा। आप अपने प्रोजेक्ट्स में तेज़ी से प्रगति करेंगे, जिससे वरिष्ठों का भरोसा बढ़ेगा। सहयोगियों के साथ संवाद में स्पष्टता लाना आवश्यक है, ताकि टीम में सामंजस्य बना रहे।', 'वित्तीय मामलों में आज कुछ अप्रत्याशित खर्चे आ सकते हैं, इसलिए बजट का ध्यान रखें। निवेश के क्षेत्र में सावधानी बरतें, जल्दबाजी से बचें। बचत की योजना बनाकर आप आर्थिक स्थिरता हासिल कर सकते हैं।', 'स्वास्थ्य के लिहाज़ से आज हल्की थकान महसूस हो सकती है, इसलिए पर्याप्त नींद लें। हल्की स्ट्रेचिंग और योग से शरीर में ऊर्जा बनी रहेगी। पाचन संबंधी समस्याओं से बचने के लिए हल्का और पौष्टिक आहार अपनाएँ।', 'आज आत्मनिरीक्षण का अच्छा समय है, अपने लक्ष्य और प्राथमिकताओं को फिर से देखें। नई कौशल सीखने या किसी कोर्स में दाखिला लेने से भविष्य में लाभ होगा। आत्मविश्वास बढ़ाने के लिए सकारात्मक पुष्टि करें।', '2026-06-16 12:26:49', 'परिवार में आज संवाद का माहौल अच्छा रहेगा, छोटे-छोटे मुद्दे आसानी से सुलझेंगे। बुजुर्गों की देखभाल में विशेष ध्यान दें, इससे आपके संबंध मजबूत होंगे। परिवारिक योजनाओं में सहयोगी बनें और समर्थन दें।', 'विद्याथी और छात्र आज अध्ययन में थोड़ी निरंतरता बनाए रखेंगे, जिससे परिणाम बेहतर आएंगे। नया विषय या प्रोजेक्ट शुरू करने का समय अनुकूल है। परीक्षा की तैयारी में नियमित अभ्यास से सफलता मिलेगी।', 'यात्रा के मामलों में छोटे-मोटे ट्रिप्स के लिए आज का दिन अनुकूल है, लेकिन लंबी दूरी की योजना में सावधानी बरतें। ट्रैफिक जाम की संभावना है, इसलिए समय से पहले निकलें। यात्रा के दौरान आवश्यक दस्तावेज़ साथ रखें।', 'आज कर्क राशि के लिए ग्रहों की स्थिति थोड़ी चुनौतीपूर्ण लग रही है, लेकिन सही सोच और धैर्य से आप इसे पार कर सकते हैं। मंगल की गति से ऊर्जा में वृद्धि होगी, जिससे आप कार्यों को तेजी से पूरा कर पाएंगे। बुध का प्रभाव आपके संचार कौशल को निखारेगा, इसलिए महत्वपूर्ण बातचीत में स्पष्ट रहें। शनि का प्रभाव आपके मन में अनुशासन लाएगा, जिससे आप लंबे समय से टाली हुई चीजें कर सकते हैं। राहु की चाल से अप्रत्याशित अवसरों का स्वागत हो सकता है, इसलिए खुला दिमाग रखिए। वृहस्पति आपकी सकारात्मक सोच को बढ़ाएगा, जिससे आप आत्मविश्वास से भर जाएंगे। कुल मिलाकर, आज आपका दिन संतुलन और अवसरों से भरा रहेगा, बस सतर्क रहें और सकारात्मक ऊर्जा को अपनाएँ।', 'South', 'हर छोटे कदम को बड़ी सफलता की ओर एक सीढ़ी मानें, और खुद पर विश्वास रखें। सकारात्मक सोच आपके सभी प्रयासों को चमकदार बना देगी।', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(132, 7, '2026-06-16', 'daily', '6', 'Turquoise', '4:00 PM - 6:00 PM', 'Love life mein aaj romance ka tadka hoga, especially agar aap single hain toh aapko koi special meeting mil sakti hai. Existing relationships mein aapko apne partner ke feelings ko samajhne ki zaroorat hogi, taki aap dono ka bond aur strong ho. Small gestures, like a thoughtful message, can make a big difference in strengthening the emotional connection today.', 'Aaj aapke career prospects mein ek naya twist aayega, jisse aapko apne skills ko showcase karne ka mauka milega. Team ke saath collaboration se aapko positive feedback mil sakta hai, especially jab aap apne ideas ko confidently present kare. Long-term goals ke liye aapko small steps plan karne honge, taki aap steady progress dekh saken.', 'Aaj aapke liye financial decisions ko carefully review karna zaroori hai. Small investments in stocks or mutual funds can yield positive returns if you analyze market trends. Avoid impulsive spending and focus on building a savings buffer for future needs.', 'Health-wise, aapko thoda fatigue feel ho sakta hai, especially if you have a busy schedule. Light exercises like walking or yoga can help maintain your energy levels. Also, make sure to hydrate well and avoid heavy meals during the afternoon to keep your mind and body sharp.', 'Personal growth ke liye aaj self-reflection ka perfect din hai. Journaling or meditation can help you understand your inner desires and motivations. Setting realistic goals for skill development will give you a sense of progress and fulfillment.', '2026-06-16 12:26:49', 'Family ke saath aapko bonding moments ka mauka milega, especially during dinner or a small gathering. Patience and listening will strengthen your relationships with relatives. A simple act of kindness can resolve any minor conflicts that may arise today.', 'Education ke liye aaj aapko study sessions ko organize karne ki zaroorat hogi, especially if exams are approaching. Break down complex topics into smaller chunks for better understanding. Collaborative study groups can enhance your learning experience and clear doubts quickly.', 'Travel plans ke liye aaj aapko flexibility aur spontaneity ka fayda milega. Short trips to nearby places can refresh your mindset and give you a new perspective. Always double-check travel details and carry essential documents to avoid last-minute hassles.', 'Aaj Tula rashi ke liye bahut hi dynamic din hai, jisme aapko apne decisions lene mein confidence milega. Ruhi se related decisions aapke liye aaj favorable rahenge, especially when you are looking for balance in your relationships. Kaam ki jagah par aapko naye projects ke liye mauka milega, par dhyan rakhen ki aap apne ideas ko clearly present kare. Health-wise, aapko thoda sa stress feel ho sakta hai, toh relax karne ke liye meditation ka sahara lein. Finance ke mamle mein small investments ka khayal rakhen, kyunki aaj market mein slight volatility ho sakti hai. Family discussions mein aapko patience dikhana hoga, especially with older relatives. Overall, aaj ka din aapke liye growth, both personally and professionally, ke liye ideal hai.', 'East', 'Aapka self-belief aaj aapko uncharted territories mein le ja sakta hai. Khud par bharosa rakhein, and success will naturally follow.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(133, 8, '2026-06-16', 'daily', '8', 'Maroon', '6:00 PM - 8:00 PM', 'Romantic partners ke saath aaj emotional bonding strong hogi, choti si baat bhi aap dono ko aur kareeb le aayegi. Single Vrishchik log ko koi interesting person mil sakta hai, lekin patience rakhna zaroori hai. Evening me koi heartfelt conversation aapke relationship ko naye level par le ja sakti hai.', 'Office me aapke ideas ko aaj sabse zyada appreciate kiya jayega, isliye confidently apni baat rakhna. Meetings aur presentations me clarity aapko senior management ka support dilayegi. Lekin, koi bhi major decision lene se pehle sabhi facts ko double‑check karna na bhoolen.', 'Financial transactions me aaj aapko thoda savdhani se kaam lena hoga, especially online payments. Investment decisions ko postpone karna behtar rahega jab tak market clear signals na de. Small savings plan start karna aaj ke liye ek accha step ho sakta hai.', 'Aaj aapko thodi fatigue feel ho sakti hai, isliye proper rest lena important hai. Light exercise jaise walking ya yoga aapke energy levels ko boost karega. Hydration par dhyan dein aur junk food se bachne ki koshish karein.', 'Self‑reflection ke liye aaj ka din best hai, meditation se aap apne inner thoughts ko samajh payenge. New skill ya hobby shuru karne ka mann ho sakta hai, jo aapki creativity ko enhance karega. Journaling se aap apne goals ko aur clear define kar sakte hain.', '2026-06-16 12:26:49', 'Parivaar ke saath aaj communication smooth rahegi, especially parents ke saath koi old issue resolve ho sakta hai. Younger siblings ko aapki guidance ki zaroorat ho sakti hai, unke liye supportive rahein. Family gatherings me aapka presence sabko uplift karega.', 'Students ke liye aaj ka din focus aur concentration ka hai, exam preparation me aapko achha result mil sakta hai. Teachers ke feedback ko positively lein, wo aapki learning ko accelerate karenge. Group studies se concepts clear honge, lekin distractions se door rahen.', 'Short trips ya weekend getaway plans aaj favor ho sakte hain, lekin travel documents double check karna na bhoolen. Traffic jams ka chance hai, isliye early departure plan karein. Solo travel me aapko new perspectives milenge, jo aapke personal growth me help karega.', 'Aaj ka din Vrishchik rashi ke liye kaafi dynamic hoga, jab Mars aur Mercury ka conjunction aapke communication aur decision-making ko boost karega. Subah ke samay aapko kuch unexpected opportunities mil sakti hain, lekin dhyan rahe ki impulsive decisions na le. Din ke beech mein, Moon ka favourable aspect aapke emotional balance ko sudharega, isse aapko mental clarity milegi. Shaam tak, Venus ka influence aapke relationships mein positivity laayega, lekin over‑thinking se bacha jaaye. Career front par, aaj aapki hard work finally recognized hogi, lekin patience ki zaroorat rahegi. Financial matters mein thoda cautious approach rakhna zaroori hai, kyunki sudden expenses aa sakte hain. Overall, aaj ka din aapke liye growth aur self‑realization ka promising din hai.', 'East', 'Apne goals ko chhote steps me divide karke aaj se hi shuruat karein. Positivity ko apna mantra banayein, kyunki aapki soch hi aapki destiny ko shape karti hai.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(134, 9, '2026-06-16', 'daily', '9', 'Blue', '6:00 AM - 8:00 AM', 'Shukra aaj aapke romantic life ko soft glow de raha hai, jo emotional bonding ko deepen karega. Single Dhanu logon ke liye koi interesting connection mil sakta hai, lekin patience se kaam lein. Existing relationships mein open communication se misunderstandings door hongi.', 'Mangal ki tithi aapke professional life mein aage badhne ke liye strong push degi. Naye projects ya promotions ke chances hain, lekin deadlines ko miss na karen. Apne colleagues ke sath collaborative approach rakhen, taki teamwork se results aur behtar ho sake.', 'Budh ki beneficence se financial planning aaj smooth rahegi, especially short-term investments. Unexpected expenses aa sakte hain, lekin aapki saving habit unko manage karegi. Credit card ka misuse na karein, kyunki impulsive spending se caution rakhna hoga.', 'Ketu ki influence se aapko thodi fatigue feel ho sakti hai, isliye proper rest lein. Digestive system par dhyan dena zaroori hai, spicy food se bachna better rahega. Light exercise, like walking or yoga, aapke energy levels ko stabilize karegi.', 'Surya ki strong presence aapko self-confidence boost kar rahi hai, jo personal goals ko achieve karne mein help karegi. Meditation aur journaling se inner clarity aayegi, jisse decisions clearer honge. New skill ya hobby start karne ka best din hai, isse aapka growth mindset strong hoga.', '2026-06-16 12:26:49', 'Parivar ke sath aaj emotional bonding strong hogi, especially elder members ke saath conversations. Kisi family member ko help karne ka mauka mil sakta hai, jo aapke relationship ko aur mazboot banayega. Dhyan rahe ki ghar ke chhote conflicts ko jaldi resolve karein, taki peace bani rahe.', 'Students ke liye Budh ki positive influence se learning speed aur retention improve hogi. Exams ya assignments ke liye aaj revision ka best time hai, isliye focused study karein. Group study se concepts clear honge, lekin distractions se bachna zaroori hai.', 'Mangal ka effect aapko short trips ya weekend getaways plan karne ke liye inspire karega. Travel safety ka dhyan rakhen, especially while driving or using public transport. New places explore karne se aapko fresh perspective milega, jo aapke creative mind ko stimulate karega.', 'Aaj Dhanu rashi ke liye grahon ka yog bahut hi dynamic hai, jo aapke mann aur body dono ko energetic feel karayega. Surya ki shakti aapke confidence ko boost karegi, isliye aap naye ideas ko boldly present kar sakte hain. Budh ka prabhav communication mein clarity laayega, lekin thoda impatience se bachna zaroori hai. Mangal ki drishti aapke career goals ko accelerate karegi, lekin impulsive decisions se caution rakhna hoga. Shukra ka influence aapke relationships mein warmth aur harmony laayega, par emotional overthinking se door rahen. Ketu ki thodi dhundh aapke health routine ko thoda challenge kar sakti hai, isliye proper diet aur exercise ki zarurat hai. Overall, aaj aapko balance banaye rakhna hoga aur opportunities ko wisely grab karna hoga.', 'South', 'Har subah thoda samay gratitude practice mein bitayein, isse positivity ka flow aapke din ko light karega. Apne goals ko likhkar visualize karein, taki aapka focus aur determination heighten ho.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(135, 10, '2026-06-16', 'daily', '9', 'Maroon', '10:00 AM - 12:00 PM', 'Love life mein aapko apne partner ke saath deeper communication ka mauka milega. Small gestures of appreciation will strengthen the bond. Singles can meet someone special through mutual friends or work events.', 'Aaj aapke career mein ek naya project shuru hoga jisse aapko growth ka mauka milega. Team collaboration will be key, especially when dealing with senior management. Apne insights ko confidently share karne se recognition milega.', 'Financial decisions will be clear today, especially with investment options. A good opportunity may arise for a modest profit, but avoid high-risk ventures. Keep a record of expenses to track your savings better.', 'Health ko maintain karne ke liye aapko sufficient sleep aur balanced meals par dhyan dena hoga. Light cardio or yoga sessions will boost your stamina. Avoid excessive caffeine and stress by taking short breaks during the day.', 'Personal growth ka focus self-reflection aur learning pe hoga. Aapko new skills develop karne ka chance milega, especially in digital tools. Time dedicate karne se long-term goals ko achieve karne mein madad milegi.', '2026-06-16 12:26:49', 'Family interactions will be harmonious, especially during evening meals. A small surprise gift can bring joy to a family member. Encourage open discussions to resolve any misunderstandings.', 'Educational pursuits will be steady, with clarity in learning processes. Teachers or mentors will provide useful guidance. Regular study schedules and group discussions will help you retain knowledge better.', 'Travel plans are favorable if you book early and avoid last-minute changes. Short domestic trips will bring relaxation and new experiences. Pack essentials wisely to avoid any discomfort during the journey.', 'Aaj Makar rashi walon ke liye kuch baray changes ki sambhavnayein hain, especially in personal relationships and career. Shubh dasha ka prabhav hai, lekin kuch chhoti challenges bhi aayenge jo aapke patience ko test karenge. Aapko apne daily routines ko thoda modify karna hoga, especially morning rituals, to maintain energy levels. Financial decisions will be smoother if you avoid impulsive spending and focus on long-term savings. Health-wise, a balanced diet and regular exercise will keep you in good shape, but be cautious of overworking. Creative ideas may flow in unexpected areas, so stay open to new opportunities. Overall, a positive day with practical steps required to maximize your potential.', 'South-East', 'Stay confident in your abilities and embrace every challenge as a learning opportunity. Remember, consistent effort turns dreams into reality.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(136, 11, '2026-06-16', 'daily', '21', 'Turquoise', '12:00 PM - 2:00 PM', 'Aapke love life mein excitement ka tadka hai. Aapke partner ke saath misunderstandings kam honge, lekin thoda patience rakhe. Aapke communication skills aapko ek strong bond build karne mein help karenge.', 'Aaj aapke professional life mein kuch naye opportunities dikhai denge. Aapke boss ya senior log aapki innovative thinking ko appreciate karenge. Yadi aap proactive rahenge, to aapko promotion ya salary increase ka chance mil sakta hai.', 'Aaj aapko small financial gains dikhai denge. Budget planning se aap apni savings ko maintain kar sakte hain. Kabhi kabhi impulsive spending se bachne ki koshish kare.', 'Aaj aapko thoda thakaan mehsoos ho sakti hai. Physical activity jaise ki walk ya light exercise aapke liye beneficial hoga. Aapko apne diet mein fresh fruits aur vegetables ko include karna chahiye.', 'Aaj aapko apne personal development pe focus karna chahiye. New skills sikhne ke liye aap online courses join kar sakte hain. Self-reflection se aap apne strengths aur weaknesses ko samajh sakte hain.', '2026-06-16 12:26:49', 'Family members ke saath aapko thoda samay bitana chahiye. Aapke parents ya siblings ke saath communication smooth hoga. Family events ke liye aapko planning karni hogi.', 'Aapke studies mein aapko concentration ki zaroorat hogi. Exam preparation ke liye aapko revision plan banana chahiye. Group study sessions aapke short-term learning ko boost karenge.', 'Aaj aapko travel plans ke liye limited options milenge. Short trips jaise weekend getaways aapke liye suitable honge. Travel expenses pe aapko mindful rehna hoga.', 'Aaj ke din aapki raat ko aapke liye bhavishyavani le kar aayi hai. Kumbh rashi ke logon ka aaj ka din thoda alag feel hoga kyunki Mars aur Saturn ki prabhav se aapke emotions thoda intense ho sakte hain. Aapke man mein naye ideas ka uttejan hoga aur aap apne creativity ko express karne ki koshish karenge. Dhyan rakhiye ki aapke thoughts ko control karte hue, aapko apne decisions ko logical level par rakhna hoga. Aapke relationships mein thoda patience ki zaroorat hogi, kyunki aapke partner ke saath misunderstandings ho sakte hain. Aapki health ke liye aapko proper sleep aur balanced diet ki importance samajhni hogi. Financially, aapko short-term gains ki badhat dekhne ko milegi, lekin long-term investments ke liye aapko samay nikalna hoga.', 'South', 'Apne goals ko clear rakhna aur unke liye daily small steps plan karna bahut zaroori hai. Positivity aur patience se aap apne challenges ko easily overcome kar sakte ho.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(137, 12, '2026-06-16', 'daily', '27', 'Turquoise', '10:00 AM - 12:00 PM', 'Relationships mein aap thoda emotional ho sakte hain, isliye apne partner ko space dena zaroori hai. Open communication se misunderstandings door hongi, especially agar aap apni feelings clearly express karein. Single Meens ke liye, koi interesting connection aaj ho sakta hai, bas aapko apni instincts par trust karna hoga.', 'Aaj aapke professional plans thode delay ho sakte hain, lekin patience se kaam lein to results ache aayenge. Mercury ke positive aspect se aapki communication skills standout hongi, isliye meetings aur presentations mein confident rahiye. Teamwork mein aapko support milne ki sambhavna hai, isliye collaborative projects pe dhyan dein.', 'Financial matters mein aaj thoda cautious approach rakhna behtar rahega, impulsive spending se bachein. Investments ke liye aaj koi major decision lene se pehle expert advice zaroor lein. Small savings ya side hustle opportunities aapke liye positive sign dikh rahe hain, bas planning sahi honi chahiye.', 'Aaj aapko thodi fatigue feel ho sakti hai, isliye proper rest lein aur hydration ka dhyan rakhein. Light exercise jaise walk ya yoga aapke energy levels ko balance karegi. Stress ko manage karne ke liye deep breathing ya meditation ka sahara lein, tabhi aap full din active feel karenge.', 'Aaj aapki introspection ki capacity high hai, isliye self-reflection ke liye kuch waqt nikaalein. New skill ya hobby start karne ka suitable time hai, especially creative fields mein. Journaling se aap apne thoughts ko organize kar payenge aur mental clarity milegi.', '2026-06-16 12:26:49', 'Family members ke saath thoda tension ho sakta hai, lekin patience aur empathy se sab resolve ho jayega. Elder relatives ki advice aaj aapke liye valuable ho sakti hai, unki baaton ko dhyan se sunein. Home environment ko pleasant banane ke liye small gestures, jaise cooking ya cleaning, kaam aayenge.', 'Students ke liye aaj concentration thodi kam ho sakti hai, isliye study schedule ko thoda break lein. Important exams ya projects ke liye revision pe focus karein, kyunki memory retention high hai. Group study ya discussion se concepts clear honge, isliye peers ke saath collaborate karein.', 'Travel plans mein thodi flexibility rakhna zaroori hai, kyunki traffic ya weather changes ho sakte hain. Short trips ya local outings aaj aapko rejuvenate karenge, isliye aap weekend getaway consider kar sakte hain. Safety measures, especially masks aur sanitizers, ko ignore na karein, tabhi aapka travel stress-free rahega.', 'Meen rashi ke log aaj thodi emotional energy feel kar sakte hain, lekin yeh aapko deeper insight dene ka mauka bhi deta hai. Mercury ka influence aapke communication ko boost karega, isliye aap apni baaton ko clear rakhne ki koshish karein. Moon ka favorable position aapke intuition ko sharp bana raha hai, jo decisions mein madad karega. Din ke beech mein kuch unexpected messages aa sakte hain, jo aapke plans ko thoda shift kar sakte hain. Kaam ke mamle mein patience rakhna zaroori hai, kyunki sabr se hi aapko achhe results milenge. Relationships mein thoda extra care dena hoga, especially with close friends and partners. Overall, aaj ka din aapko grow karne ka ek achha platform de raha hai, bas aapko apni energies ko sahi direction mein channelize karna hai.', 'North-West', 'Apni inner voice ko suno aur doubts ko side mein rakhkar bold steps lo. Har chhoti success ko celebrate karo, kyunki wahi aapko aage badhne ki energy degi.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(138, 1, '2026-06-16', 'weekly', '8', 'Silver', '8:00 AM - 10:00 AM', 'Prem sambandhon mein aapko clarity mil rahi hai, jo aapke partner ke saath deeper connection banane mein madad karegi. Single Aries ko koi interesting person mil sakta hai, lekin patience se baat cheet karein. Old conflicts ko resolve karne ka sahi samay hai, isse relationship stronger hoga.', 'Career sector mein aapko naye projects milenge jo aapki creativity ko highlight karenge. Meetings aur presentations mein aapki confidence high rahegi, isliye apne ideas ko boldly present karein. Lekin overworking se bachne ke liye breaks lena zaroori hai, warna burnout ho sakta hai.', 'Financial front par aapki income stable hai, lekin kuch unexpected kharch aane ki sambhavna hai. Savings ko secure rakhne ke liye short-term deposits ya fixed deposits consider karein. Investment decisions mein thoda research karein, impulsive moves se bachen.', 'Health ke mamle mein, aapko regular exercise routine maintain karna chahiye, especially cardio aur yoga. Diet mein fresh fruits aur sabziyon ka istemal badhayein, aur junk food se door rahein. Stress management ke liye meditation ya breathing exercises helpful rahenge.', 'Personal growth ke liye aapko apni inner motivations ko samajhna hoga, meditation se self-awareness badhegi. New hobbies ya skill learning se mental stimulation milegi aur confidence barhega. Journaling se aap apne thoughts ko organize kar sakte hain, jo progress ko track karne mein madad karega.', '2026-06-16 12:27:15', 'Parivaar ke sath communication thoda intense ho sakta hai, lekin patience se sab kuch smooth ho jayega. Elder members ki advice ko dhyan se sunna aapke liye faydemand rahega. Ghar ke kuch minor repairs ya renovations ka plan bana sakte hain, jo harmony ko boost karega.', 'Students ke liye yeh hafta focus aur discipline ki demand karega, especially exams ke preparation mein. Study groups join karne se concepts clear honge aur motivation barhegi. Breaks aur proper sleep ko neglect na karein, warna concentration issues ho sakte hain.', 'Travel plans me aapko short trips ya weekend getaways ka moka mil sakta hai, jo mind fresh karega. Safety measures follow karna zaroori hai, especially traffic rules ka dhyan rakhein. Travel expenses ko budget mein rakhne se financial stress kam hoga.', 'Aries rashi ke logon ke liye yeh hafta bahut hi dynamic rahega, jabki Mars ki shakti aapke ambitions ko boost karegi. Kaam ke mamle mein aapko naye opportunities mil sakti hain, lekin decision-making mein thodi caution zaroori hai. Ghar ki environment thodi chaotic ho sakti hai, isliye patience se kaam lein. Financial front par aapko kuch unexpected expenses dekhne ko mil sakte hain, lekin long-term investments ke liye yeh sahi samay hai. Health wise, aapko apni diet par dhyan dena hoga, especially oily foods se door rehna. Love life mein aapko emotional clarity milne wali hai, jo misunderstandings ko door karegi. Overall, yeh hafta aapko growth aur self-awareness ka chance dega, bas aapko apni energy ko sahi direction mein channel karna hoga.', 'South-West', 'Har subah positivity ke saath uthen aur apne goals ko visualize karen. Choti choti achievements ko celebrate karen, kyunki wahi aapko aage badhne ki energy deti hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(139, 2, '2026-06-16', 'weekly', '2', 'Purple', '4:00 PM - 6:00 PM', 'Love life mein aapko emotional stability feel hogi, jo aapke partner ke saath deeper bonding create karegi. Single Taurus logon ko koi interesting person mil sakta hai, bas apni genuine side dikhane se connection banega. Thodi patience rakhne se misunderstandings door hongi aur relationship strong hoga.', 'Career front par aapke efforts ka fal milna shuru hoga, especially agar aap team projects mein involve hain. New responsibilities aapke liye aayengi, lekin aapko apni planning ko tight rakhna hoga. Apne skills ko upgrade karne ka sahi samay hai, jisse promotion ya salary hike ka chance badh jayega.', 'Finance side par aapko spending ko control karna hoga, kyunki impulsive purchases temptation ho sakte hain. Savings aur investments par focus karne se aane wale months mein stability aayegi. Unexpected expense aane ki possibility hai, isliye emergency fund ready rakhen.', 'Health ke liye aapko regular exercise aur balanced diet par dhyan dena zaroori hai, varna fatigue ho sakti hai. Stress management ke liye meditation ya pranayama bahut faydemand rahega. Hydration ka level maintain rakhen, especially agar aap outdoor activities plan kar rahe hain.', 'Personal growth ke liye aapko self-reflection ka samay nikalna chahiye, jo aapke inner goals ko clear karega. New hobbies ya learning modules start karne se aapki confidence boost hogi. Apni strengths ko recognize kar ke aap future challenges ko easily handle kar sakte hain.', '2026-06-16 12:27:15', 'Family ke saath communication improve hoga, jo old misunderstandings ko clear karega. Aapke support se ghar ke members ko emotional comfort milega. Weekend par family gathering plan karne se bonding strong hogi aur sabko khushi milegi.', 'Education ya skill development ke liye aapko consistent study schedule banana hoga. Exams ya projects ke deadlines aane wale hain, isliye time management crucial hai. Group study ya mentorship se aapki understanding aur clarity badhegi.', 'Travel plans thode delay ho sakte hain, lekin short trips ya local outings aapke mood ko fresh karenge. Road trips ke liye safety measures follow karen aur proper planning rakhen. Travel expenses ko budget mein rakhna financial stress se bachayega.', 'Taurus sign ke logon ke liye yeh hafta bahut dynamic rahega, jab ki Shukra aur Mangal ki drishti aapke communication aur energy levels ko boost karegi. Kaam ke mamle mein aapko naye opportunities mil sakti hain, lekin decision lete waqt thoda dhairya rakhna zaroori hai. Pyaar mein aapki emotional stability aapko partner ke saath deeper connection banane mein madad degi. Health side par, aapko apne diet aur exercise routine par dhyan dena hoga, kyunki thakan ka asar ho sakta hai. Financial matters mein aap thoda cautious approach rakhen, unnecessary kharch se bachein. Family ke saath samay bitane ka mauka milega, jo aapke emotional balance ko strong karega. Overall, yeh hafta aapke liye growth aur self-awareness ka hai, bas thoda balanced approach rakhen.', 'East', 'Apni positivity ko banaye rakho, kyunki aapki soch hi aapki reality ko shape karti hai. Har din thoda sa self-care karna mat bhoolna, success usi ke saath aayegi.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(140, 3, '2026-06-16', 'weekly', '36', 'Golden', '6:00 AM - 8:00 AM', 'Love life mein thodi emotional turbulence ho sakti hai, lekin open communication se misunderstandings door ho jayengi. Single Mithuns ko social events mein interesting connections mil sakte hain, bas apni genuine self ko dikhayein. Couples ke liye ye samay ek dusre ki needs ko samajhne aur respect karne ka hai, jo bond ko strong karega.', 'Is hafte aapke career mein naye opportunities ka darwaza khulne ki sambhavna hai, especially creative fields mein. Projects ke deadlines tight ho sakte hain, lekin aapki analytical skills unhe efficiently handle karengi. Team ke saath collaboration smooth rahegi, isliye leadership roles accept karne se aapko recognition mil sakta hai.', 'Financial front par aapko kuch unexpected expenses ka samna karna pad sakta hai, isliye budgeting zaroori hai. Investments ke liye short-term gains se zyada long-term stability dekhna behtar rahega. Savings ko alag se allocate karne se aapko financial peace mil sakti hai.', 'Health perspective se aapko digestive system par dhyan dena chahiye, heavy oily foods se bachna zaroori hai. Regular walking ya light yoga aapke stamina ko boost karegi aur stress ko kam karegi. Sufficient sleep aur hydration ko priority dein, taki immune system strong rahe.', 'Personal growth ke liye meditation aur journaling se aap apne inner thoughts ko clear kar sakte hain. New skill ya hobby start karna aapke confidence ko boost karega. Self-reflection se aap apne goals ko re-align kar sakte hain, jo aapko higher purpose ki taraf le jayega.', '2026-06-16 12:27:15', 'Family members ke saath communication thoda intense ho sakta hai, lekin patience se sab misunderstandings resolve ho jayenge. Elder relatives ki health ko monitor karna zaroori hai, unko regular check-ups ke liye encourage karein. Family gatherings mein aapki presence aur positivity sabko uplift karegi.', 'Students ke liye ye week focus aur discipline ka test hoga, especially upcoming exams ke liye. Study groups join karne se concepts clear honge aur motivation bani rahegi. Practical applications par dhyan dene se knowledge deeper hogi, jo future projects mein help karegi.', 'Travel plans mein short trips ya weekend getaways aapko refresh karenge, lekin safety measures follow karna mat bhoolen. Traffic jams aur delays ho sakte hain, isliye extra time allocate karein. New places explore karne se aapki creativity aur perspective broaden hoga.', 'Mithun rashi ke liye is hafte bahut hi dynamic energies ka samna hoga, jo aapke soch aur actions dono ko tez kar denge. Mercury ka favourable transit communication ko smooth banata hai, isliye meetings aur discussions mein aapka confidence high rahega. Din ki shuruaat subah ki meditation se karein, taki mental clarity bani rahe aur stress kam ho. Work life mein naye projects aane ki sambhavna hai, lekin deadlines ko dhyan se manage karein. Personal relationships mein thodi tension ho sakti hai, par patience se sab theek ho jayega. Health wise, aapko apne diet par dhyan dena zaroori hai, especially digestion ko support karne wale foods. Overall, agar aap apni energy ko sahi direction mein channel karenge, to yeh hafta aapke liye growth ka golden period ban sakta hai.', 'North-West', 'Har subah apne aapko ek positive affirmation dein, jo aapke din ko energize kare. Challenges ko growth opportunities ki tarah dekhen, tabhi aap har situation ko master karenge.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(141, 4, '2026-06-16', 'weekly', '11', 'Maroon', '7:00 AM - 9:00 AM', 'Romantic relationships mein emotional bonding ka level badhega, aap dono ek dusre ko better samajhne lagenge. Single Cancer logon ko koi meaningful connection mil sakta hai, bas thoda patience rakhein. Couples ko mutual respect aur small gestures se apni love ko fresh rakhna chahiye.', 'Office mein aapke ideas ko alag nazar se dekha jayega aur aapko naye projects mil sakte hain. Meetings mein aapki communication strong hogi, isliye apne thoughts ko confidently present karein. Lekin deadlines ke pressure ko manage karna hoga, warna stress ho sakta hai.', 'Income side par chhote gains ho sakte hain, shayad freelance ya side projects se extra paisa aayega. Expenses ko control karna zaroori hai, especially unnecessary shopping se bachna. Savings plan ko revise karna aur emergency fund ko strengthen karna beneficial hoga.', 'Energy levels moderate rahenge, lekin early morning walk ya yoga se aapko freshness milegi. Digestive system thoda sensitive ho sakta hai, isliye oily food se bachain. Stress management ke liye meditation ya deep breathing exercises faydemand rahenge.', 'Inner self-reflection ka time hai, journaling se aap apne emotions ko better samajh sakte hain. New skill ya hobby start karna aapke confidence ko boost karega. Spiritual practices, jaise mantra chanting, aapko mental peace degi.', '2026-06-16 12:27:16', 'Ghar par senior members se kuch important advice mil sakta hai, unki baaton ko dhyan se sunen. Family gatherings mein aapki presence sabko uplift karegi. Minor misunderstandings ho sakte hain, lekin patience se sab resolve ho jayenge.', 'Students ke liye concepts clear karne ka acha week hai, especially group studies se fayda hoga. Exams ke preparation mein consistency aur short breaks lena zaroori hai. Teachers se extra guidance lene se aapki performance improve hogi.', 'Short trips ya weekend getaways aapke mood ko refresh karenge, planning ko last minute na rakhein. Travel plans mein safety measures aur health precautions ka dhyan rakhein. Long distance travel abhi thoda risky lag sakta hai, isliye postpone karna better hoga.', 'Cancer sign ke logon ke liye is hafte ki shuruaat emotional energy se bhari hogi, jo aapko deeper connections banane mein madad degi. Moon ka influence aapke intuition ko boost karega, isliye decisions lene se pehle apni gut feeling par bharosa karein. Workplace mein aapki creativity ko recognition milne ka mauka hai, lekin over-commitment se bachna hoga. Financial matters mein thoda cautious rehna zaroori hai, especially impulsive spending se door rahen. Relationships mein affection aur understanding ka gehra level develop hoga, jo aapke bond ko strong banayega. Health front par aapko routine exercise aur proper diet se energy levels maintain karne ki zarurat hai. Overall, ye hafta aapko growth, stability aur emotional fulfillment ka balanced mix dega.', 'East', 'Apni instincts par bharosa rakho, kyunki aaj ka din aapko sahi direction dikhayega. Har choti success ko celebrate karo, ye aapko aage badhne ki energy degi.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(142, 5, '2026-06-16', 'weekly', '11', 'Maroon', '8:00 AM - 10:00 AM', 'Pyaar ki baat kare to single logon ko koi interesting person mil sakta hai, jisse aapka dil jaldi dhadke. Jo couples hain, unke beech communication improve hoga, lekin thodi jealousy ko control me rakhna hoga. Emotional openness se aapka bond aur strong hoga, bas patience zaroori hai.', 'Career ke mamle me aapko kuch new projects milne ki sambhavna hai, jo aapki leadership qualities ko highlight karenge. Office me aapki communication abhi aur bhi effective hogi, isliye presentations aur negotiations me aapka impact badega. Lekin, overworking se bachein, kyunki thakan se performance me dip a sakti hai.', 'Finance me aapko kuch extra income ka chance mil sakta hai, lekin unnecessary shopping se bachna hoga. Investments me short term gains chase karne se pehle thorough research karein. Budget banayein aur unnecessary kharchon ko cut down karein.', 'Health me aapko energy high feel hogi, lekin high caffeine ya junk food se bachna chahiye. Regular walk ya light exercise se stamina maintain rahega. Stress ko manage karne ke liye meditation ya deep breathing exercises faydemand rahenge.', 'Personal growth ke liye aapko self-reflection ka time milega, jo aapki inner clarity ko boost karega. New hobbies ya skill learning se aapka confidence level upar jayega. Apne comfort zone se bahar nikal kar naye experiences ko embrace karein.', '2026-06-16 12:27:16', 'Family ke sath communication smooth rahegi, lekin kuch purane misunderstandings ko clear karna zaroori hai. Parents ya elder members ki health par dhyan dena hoga, unki care aapke liye priority ho. Family gatherings me aapka presence sabko motivate karega.', 'Students ke liye yeh hafta focus aur concentration me boost dega, isliye exams ya projects me achha performance de sakte hain. Group studies se ideas ka exchange faydemand hoga. However, procrastination se bachne ke liye time management zaroori hai.', 'Travel plans me short trips ya weekend getaways ka mauka mil sakta hai, jo aapke mind ko refresh karega. Safety measures follow karna zaroori hai, especially traffic rules ka. Travel se related paperwork ya bookings me thoda patience rakhein.', 'Lion ke rashi ke logon ke liye yeh hafta bahut hi dynamic hoga, aapko naye opportunities ke saath hi kuch challenges bhi mil sakte hain. Mercury ki shukla paksh ki sthiti se aapke communication skills sharp ho jayenge, isliye meetings aur discussions me aapka prabhav badhega. Mars ki sthiti se aapki energy level high rahegi, lekin impulsive decisions se bachna zaroori hai. Shukra ki drishti aapke relationships par positive effect dalegi, lekin emotional balance banaye rakhna hoga. Ketu ki chhavi se aapke inner thoughts deep honge, meditation ya yoga se mental clarity mil sakti hai. Financial sector me thoda caution zaroori hai, kyunki unexpected expenses aa sakte hain. Overall, yeh hafta aapke liye growth aur self-awareness ka perfect mix laayega, bas dhairya aur discipline se kaam lein.', 'North-East', 'Har subah apne goals ko visualize karein, tabhi aapka din purposeful hoga. Consistency aur positive attitude se aap har challenge ko aasani se paar kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent');
INSERT INTO `horoscopes` (`id`, `zodiac_id`, `date`, `type`, `lucky_number`, `lucky_color`, `lucky_time`, `love`, `career`, `money`, `health`, `personal_growth`, `created_at`, `family`, `education`, `travel`, `overview`, `lucky_direction`, `tip_of_the_day`, `love_status`, `career_status`, `health_status`, `finance_status`, `personal_growth_status`) VALUES
(143, 6, '2026-06-16', 'weekly', '2', 'Orange', '12:00 PM - 2:00 PM', 'Love life me aap thoda emotional ho sakte hain, especially single logon ko apni expectations ko realistic rakhna chahiye. Couples ke beech communication improve hoga, lekin small misunderstandings ho sakti hain, unhe jaldi resolve karein. Romance ka mood high rahega, koi surprise date ya thoughtful gesture relationship ko fresh bana sakta hai.', 'Career me aapko naye projects mil sakte hain jo aapki precision ko showcase karenge. Team ke saath communication thoda tight ho sakta hai, isliye clarity se baat karein. Hard work se aapko promotion ya raise ka chance mil sakta hai, bas patience aur dedication zaroori hai.', 'Finance me kuch unexpected bills aane ki sambhavna hai, lekin aapki savings buffer isko absorb kar legi. Investment decisions me thoda cautious rahna zaroori hai, impulsive moves se bachiye. Budget banakar har expense ko track karna is hafte ka best strategy hai.', 'Health me digestive issues jaise acidity ya gas ho sakti hai, isliye spicy food se door rahiye. Light exercise jaise yoga ya brisk walk aapko energetic rakhegi. Sleep pattern thoda irregular ho sakta hai, isliye raat ko phone ka use kam karein aur early bedtime set karein.', 'Personal growth ke liye meditation aur journaling aapko mental clarity degi. New skill ya hobby start karne ka best time hai, especially koi creative activity. Self-reflection se aap apni strengths aur weaknesses ko better samajh sakte hain, jo future decisions me help karega.', '2026-06-16 12:27:16', 'Family me kuch minor conflicts ho sakte hain, especially older members ke saath. Unke perspective ko respect karna aur patience se sunna relationship ko smooth banayega. Weekend me family gathering plan karne se emotional bonding strong hogi.', 'Students ke liye exams ka stress high ho sakta hai, lekin proper planning se accha performance de sakte hain. Revision schedule banakar topics ko systematically cover karein. Group study se concepts clear honge aur confidence bhi badega.', 'Travel plans me thoda delay ho sakta hai, especially due to traffic ya weather issues. Short trips ke liye weekend ka best time hai, jo aapko refresh karega. Safety measures follow karna aur travel insurance check karna mat bhooliye.', 'Kanya rashi ke logon ke liye is hafte ka graha stithi kaafi dynamic rahegi, jab Mercury aur Venus dono hi aapke 6th house me strong position me hain. Kaam me choti choti details par dhyan dena aapko aage badhne me madad karega, kyunki aapki analytical mind shining karegi. Social media par aane wale messages aapke liye acchi opportunities ka signal de sakte hain, lekin sabko verify karna mat bhooliye. Ghar par thoda stress ho sakta hai, especially jab family members ke expectations high ho, isliye patience rakhein. Health ke mamle me, digestion system thoda upset ho sakta hai, isliye light diet follow karein. Financial front par, kuch unexpected expense aa sakta hai, lekin aapki planning isko easily manage kar degi. Overall, is hafte aapko self-discipline aur positive attitude se hi sab challenges ko convert karna hoga.', 'North-West', 'Har subah ek positive affirmation ke saath din ki shuruat karein, kyunki aapki soch aapki reality banati hai. Consistency aur self-belief se aap har challenge ko opportunity me badal sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(144, 7, '2026-06-16', 'weekly', '5', 'Purple', '8:00 AM - 10:00 AM', 'Pyar ke mamle mein Venus ke energy se aapke relationships mein warmth aayegi. Agar aap single hain, to aapko social events ya work-related gatherings mein koi interesting person se milne ka chance mil sakta hai. Couples ke liye, ek small surprise ya thoughtful gesture se aapke bond ko strengthen karne ka sahi samay hai. Compatibility test ya shared hobbies se aap beech ki understanding badh sakti hai.', 'Karyakshetra mein aapko apni teamwork skills ko highlight karna hoga, especially jab aapko complex tasks assign kiye ja rahe hon. Aapke creative ideas ko senior management tak pohanchane ka mauka bhi mil sakta hai, lekin dhyaan rahe ki aap clear communication rakhen. Short-term projects ke liye aapko patience aur focus ki zaroorat hogi, taki aap deadlines ko meet kar sake.', 'Money matters mein aapko apne savings plan ko review karna chahiye, especially impulsive spending ke against. Small investments, jaise mutual funds ya systematic transfer plans, aapko long-term benefits de sakte hain. Weekly expenses ko track karna aur unnecessary purchases se bachaana is time pe crucial hai.', 'Aapke health ke liye yeh week ek balanced routine adopt karne ka sahi samay hai. Thoda cardio exercise aur yoga se aap stress levels ko kam kar sakte hain. Nutrition wise, seafood aur leafy greens ko apne diet mein shamil karne se aapko energy boost milega. Hydration par dhyaan dena zaroori hai, especially afternoon ke hours mein.', 'Apne personal growth ke liye aapko self-reflection ke liye kuch waqt nikalna hoga. Meditation ya journaling se aap apne thoughts ko organize kar sakte hain. Self-help books ya online courses se aapke skill set ko upgrade karne ka mauka milega, especially in areas like communication and time management.', '2026-06-16 12:27:16', 'Family dynamics mein aapko patience aur understanding dikhani hogi. Agar koi disagreement ho to calm discussions se resolve karna behtar hoga. Family members ke saath quality time spend karne se emotional bond strengthen hoga. Ek simple family dinner ya movie night aapke relationship ko positive direction de sakti hai.', 'Agar aap student hain, to aapke exams ke liye focused study sessions important honge. Online tutorials ya group discussions se aap concepts ko aur achhe se samajh sakte hain. Agar aap professional development kar rahe hain, to certification courses se aapki expertise enhance hogi, but time management pe dhyaan dena zaroori hai.', 'Travel plans ke liye aapko thoda advance booking karna chahiye, especially if you plan to visit popular destinations. Small road trips ya city explorations se aapko refreshment milega aur aapke mind ko clarity milegi. Travel during weekends best rahega to avoid work-related stress. Pack wisely and keep a small first-aid kit in case of minor ailments.', 'Tula rashi ke liye is hafte ki energy thodi sa tight feel ho sakti hai, lekin yeh aapko apni priorities ko reset karne ka mauka bhi degi. Aapke raashiyon ke beech mein Mercury ka influence aapko communication skills ko polish karne ki salah deta hai, jisse aap na sirf professional ban sakte hain balki personal relationships mein bhi clarity aayegi. Monday se shuru hokar, aapko apne office ke project par dhyaan dena hoga, kyunki Venus ke alignment se aapke efforts ko appreciation milegi. Friday ke aas-paas aapke financial prospects thoda uplift honge, lekin impulsive spending se bachaana zaroori hai. Aapke health ki baat karein to, aapko ek balanced diet aur light exercise routine adopt karna chahiye, especially jab aapko stress level high lag raha ho. Family ke mamle mein, ek small gathering ya simple dinner se bonding strong hogi, while aapke personal growth ke liye, ek online course ya webinar join karna beneficial rahega. Overall, ye week aapko self-awareness badhane ka aur apne long-term goals ko refine karne ka perfect platform de raha hai.', 'North-East', 'Apne din ki shuruaat positivity se karo, aur har challenge ko ek opportunity samjho. Keep your heart open and your mind focused, success will naturally flow your way.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(145, 8, '2026-06-16', 'weekly', '21', 'Silver', '2:00 PM - 4:00 PM', 'Love life mein aapko thoda emotional turbulence face karna padega, especially if you are in a committed relationship. Apne partner ke saath open communication se misunderstandings door honge. Singles ke liye networking events aapke liye luck bring kar sakte hain, but be cautious with online interactions.', 'Career mein aapko naye projects ke liye kaafi pressure mehsoos hoga, lekin aapki determination se ye challenges overcome ho jayenge. Team ke saath collaboration se aapko unexpected support milegi, especially agar aap apni ideas clearly communicate karenge. Aapke hard work ka result turant nazar nahi aayega, lekin patience aur persistence se aapko long-term benefits milege.', 'Financially, aapke expenses thoda increase honge, especially on travel or leisure. Smart spending aur timely bill payments se aap apne budget ko control kar sakte hain. Unexpected expenses ke liye aapko contingency plan ready rakhna chahiye.', 'Health wise, aapko thoda fatigue feel hoga due to increased work hours. Hydration aur balanced diet ko priority dena zaroori hai. Light exercise jaise walking ya yoga se aap energy levels ko maintain kar sakte hain.', 'Personal growth ki baat kare to aapko self-reflection ka time zaroori hai. Apne past mistakes ko analyze karne se future decisions improve honge. Mindfulness practices jaise meditation aapki focus aur clarity ko enhance karenge.', '2026-06-16 12:27:16', 'Family dynamics mein some tension could arise due to differing opinions. Apne relatives ke saath empathy aur active listening se aap harmony restore kar sakte hain. Small gestures like sharing a meal can strengthen bonds.', 'Education ke field mein aapko extra effort lagana hoga to maintain grades. New study techniques ya group discussions se aapko better understanding milegi. Exam schedule pe focus karne ke saath stress management bhi important hai.', 'Travel plans may be postponed because of work commitments. However, a short weekend getaway can rejuvenate your mind. You should plan your trip early and stick to a budget to avoid last-minute surprises.', 'Aaj ka week aapke liye thoda challenging ho sakta hai, especially jab aapko ek major decision lena hoga. Aapke mind mein kai conflicting thoughts aayenge, lekin dhairya se kaam lene se hal mil jayega. Venus ki influence se relationships mein thodi tension aa sakti hai, par samajhdari se sab theek ho jayega. Career mein aapko kuch unexpected opportunities mil sakti hain, lekin unko capture karne ke liye proactive hona zaroori hai. Health-wise, aapko apni diet aur exercise routine ko dhyan dena hoga, otherwise fatigue ka risk badh sakta hai. Financially, aapke pocket ko thoda tight feel hoga, lekin smart budgeting se aap risk ko control kar sakte hain. Overall, week aapke liye growth ka platform hai, bas aapko apne emotions ko control mein rakhna hoga.', 'South', 'Har challenge ko ek opportunity samjho. Apne goals ki taraf steadily move karo, success aapke kadam chhuegi.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(146, 9, '2026-06-16', 'weekly', '5', 'Red', '6:00 AM - 8:00 AM', 'Love life mein aapko thoda emotional ups and downs dekhne ko mil sakte hain, lekin patience se sab theek ho jayega. Single Dhanu logon ke liye koi interesting milan ho sakta hai, bas apni instincts par bharosa rakhein. Couples ko mutual respect aur open communication se relationship ko strong bana sakte hain.', 'Career zone mein aapko naye projects mil sakte hain jo aapki creativity ko highlight karenge. Team ke saath collaboration improve hoga, lekin deadlines ko meet karna priority rahega. Agar aap promotion ki soch rahe hain, to apni consistency aur hard work ko dikhana zaroori hai.', 'Finance mein aapko kuch unexpected expenses dekhne ko mil sakte hain, isliye emergency fund ready rakhein. Investments par dhyan dein, lekin impulsive decisions se bachen. Savings plan ko review karna aur unnecessary subscriptions ko cancel karna is hafte faydemand rahega.', 'Swasthya ke liye aaj aapko regular exercise aur proper sleep ki zaroorat hai. Digestive system thoda sensitive ho sakta hai, isliye oily aur heavy foods se bachna chahiye. Meditation ya pranayama se stress level kam hoga aur energy level stable rahega.', 'Personal growth ke liye aapko self‑reflection ka waqt nikalna chahiye, jo aapko inner clarity dega. New skill ya hobby shuru karne se confidence boost hoga. Journaling aur gratitude practice se aapka mental outlook positive rahega.', '2026-06-16 12:27:16', 'Family members ke saath thoda misunderstanding ho sakti hai, par patience aur samajhdaari se sab theek ho jayega. Elder relatives ki health ko lekar extra care dena zaroori hai. Ghar ke financial decisions mein sabki rai lena harmony banaye rakhega.', 'Students ke liye focus level thoda fluctuating ho sakta hai, isliye study schedule ko tighten karna chahiye. Important exams ke liye revision aur mock tests se preparation strong hogi. Teachers ke suggestions ko dhyan se sunna aur unke guidance ko follow karna faydemand rahega.', 'Travel plans mein aapko last minute changes dekhne ko mil sakte hain, isliye flexible rahna zaroori hai. Short trips ya weekend getaways aapki mental refresh ke liye achhe rahenge. Safety measures aur proper planning se aapka travel experience smooth rahega.', 'Is hafte Dhanu rashi ke liye shukra aur budh ki shaktiyan mil kar aapke mann aur dil ko sukoon denge. Aapke vichar thode zyada vivid honge, isliye naye ideas ko explore karna faydemand rahega. Professional life mein kuch unexpected opportunities aane ki sambhavna hai, lekin dhairya aur samay ka palan karna zaroori hai. Ghar par rishton mein thoda tension ho sakta hai, par communication se sab theek ho jayega. Swasthya ke mamle mein aapko apne diet par dhyan dena hoga, especially digestion par. Financial side mein thode kharchon ko control karna hoga, varna budget tight ho sakta hai. Overall, yeh hafta aapke liye self‑development aur balance banane ka acha samay hai.', 'South-East', 'Apni har subah gratitude se shuru karo, tabhi din ki positivity aapke saath rahegi. Hard work aur patience ko apna mantra banao, safalta zaroor milegi.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(147, 10, '2026-06-16', 'weekly', '21', 'Purple', '6:00 AM - 8:00 AM', 'Single Makars ke liye koi special milne ki ashha hai, lekin patience rakhna zaroori hai. Existing relationships me emotional honesty ka level high rahega, jo bonding ko aur gahra karega. Small misunderstandings ho sakti hain, lekin samay par baat karne se sab clear ho jayega.', 'Office me aapko senior se recognition milne ki sambhavna hai, jo aapke confidence ko boost karegi. Projects me thoda delay ho sakta hai, lekin aapki planning se sab smoothly ho jayega. Networking events me part lene se future growth ke liye naye doors khulenge.', 'Aapko koi unexpected financial gain mil sakta hai, jaise bonus ya gift. Spending me thoda caution rakhen, especially luxury items par. Savings plan ko revise karen, kyunki aane wale mahine me invest karne ke acche mauke milenge.', 'Thoda stress feel ho sakta hai, isliye meditation ya pranayama se mind ko shant rakhen. Digestive system thoda sensitive ho sakta hai, isliye oily aur spicy foods se bachain. Light exercise, jaise brisk walk, aapki energy levels ko maintain rakhegi.', 'Is hafte aapko self-reflection ka mauka milega, jo aapke inner goals ko clarify karega. New hobbies ya skill development ke liye online courses join kar sakte hain. Spiritual practices jaise chanting ya mantra jaap se mental clarity badhegi.', '2026-06-16 12:27:16', 'Family members ke saath ghoomne ka plan ban sakta hai, jo sabko happy feel karayega. Elder parents ki health par dhyan dena zaroori hai, unke liye regular check-ups schedule karen. Younger siblings ke saath communication improve hogi, isliye unke ideas ko appreciate karen.', 'Students ke liye exams ki preparation me thoda extra focus ki zaroorat hai, revision schedule tight rakhen. Online webinars aur workshops se knowledge broaden hogi. Teachers ke guidance ko dhyan se sunen, tabhi aapko acchi marks milengi.', 'Short weekend trips ka plan ban sakta hai, lekin travel bookings ko early karen to best rates mile. Traffic aur weather ki updates check karte rahen, especially monsoon ke dinon me. Travel se aapko mental refreshment milega, jo productivity ko boost karega.', 'Makar rashi ke logon ke liye ye hafte bahut dynamic rahega, jabki Saturn ki shakti aapke discipline ko aur bhi majboot karegi. Workplace me naye responsibilities aane ki sambhavna hai, isliye apne plans ko thoda flexible rakhna zaroori hai. Communication me thodi rukawat aayegi, lekin dhairya rakhen to sab theek ho jayega. Relationships me emotional bonding strong hogi, khas kar family ke saath. Financial front par unexpected income ka chance hai, lekin kharchon par nazar rakhna hoga. Health me thodi fatigue feel ho sakti hai, isliye proper rest aur diet ka dhyan rakhen. Overall, is hafte aapko apne goals ko realign karne ka mauka milega, bas positivity ko banaye rakhen.', 'East', 'Har subah gratitude journal likhen, isse positivity ka flow aapke din me aayega. Apne goals ko chhote steps me divide karen, taki progress consistent rahe.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(148, 11, '2026-06-16', 'weekly', '9', 'Purple', '6:00 AM - 8:00 AM', 'Love life mein aapke partner ke saath emotional bonding strong ho jayega. New people se milne ka mauka bhi hai, especially through social events or online platforms. Aapko apne partner ke feelings ko samajhne aur share karne ki koshish karni hogi, jisse relationship aur bhi gehra ho.', 'Career ke maamle mein aapke hardworking nature se aapko recognition milne ki sambhavna badh rahi hai. Aapke projects mein innovation aur efficiency dono hi level up ho jayega, especially if you collaborate with like-minded colleagues. Aapko thoda risk lena hoga, but it could lead to a significant career advancement.', 'Financially, aapke liye small gains aur unexpected income streams ka potential hai. However, large expenses ya impulsive spending se bachna zaroori hai. Budgeting aur savings plans ko tighten karna aapko long-term stability provide karega.', 'Health ke mamle mein aapko thoda fatigue feel hoga due to increased activity. Aapko physical activity ko moderate rakhna chahiye aur hydrating habits ko follow karna chahiye. Proper sleep aur relaxation techniques aapko ek healthy balance maintain karne mein madad karenge.', 'Personal growth ke aspects mein aapko self-awareness aur introspection ka mauka milega. Aapko apne strengths aur weaknesses ko samajhna hoga, especially in creative pursuits. This introspection will help you align your goals with your authentic self.', '2026-06-16 12:27:16', 'Family dynamics mein aapko support aur understanding mil sakti hai, especially from elder family members. Small conflicts may arise due to differences in opinions, but communication will resolve them. Aapko family time ko prioritize karna chahiye aur unke saath quality moments spend karne ka plan banana chahiye.', 'Education ke field mein aapko new learning opportunities mil sakte hain, especially through online courses or workshops. You might find a mentor or guide who can help refine your skills. However, balancing study with other commitments will require disciplined time management.', 'Travel plans ke liye aapko short trips aur weekend getaways ka plan banane ka mauka milega. Aapko budget-friendly options choose karne chahiye, especially if you plan to visit familiar destinations. Travel ke dauran aap apne interests ko explore kar sakte hain, especially in cultural or nature-based settings.', 'Is week mein Kumbh rashi wale logon ke liye kuch naya aur exciting aane wala hai. Disha ke planet Venus ka prabhav aapke relationships ko aur gehra karega, lekin iske saath aapko apne personal goals ko bhi dhyan dena hoga. Aapko apne professional skills ko upgrade karne ka mauka milega, especially in tech or creative fields. Health wise, thoda overexertion ka risk hai, isliye rest aur balanced diet par focus karein. Financially, small gains aur unexpected income streams ka potential hai, par judicious spending zaroori hai. Family dynamics mein aapko patience aur communication ki zaroori feel hogi. Overall, ek balanced approach se aap apne week ko behtar bana sakte hain, with mindful decisions and positive energy.', 'North', 'Har din apne goals ko revise karein aur priorities set karein, taki aap focused rahen. Positive mindset aur gratitude practice se aap apni success ko amplify kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(149, 12, '2026-06-16', 'weekly', '45', 'Golden', '4:00 PM - 6:00 PM', 'Love life mein aapko emotional depth ka experience hoga, jo aapke partner ke saath bond ko strong karega. Single Meen logon ko koi interesting connection mil sakta hai, lekin clarity ke saath approach karein. Old misunderstandings ko resolve karna beneficial hoga, isse relationship fresh feel karega.', 'Career side par aapko naye projects mil sakte hain jo aapki creativity ko showcase karenge. Boss ya seniors aapke hard work ko notice karenge aur promotion ya salary hike ke chances badhenge. However, deadlines tight ho sakte hain, isliye time management pe dhyan dena zaroori hai.', 'Finance mein aapke paas extra income ke sources open ho sakte hain, jaise freelance ya side gigs. Spending par control rakhein, especially luxury items par impulsive purchases se bachein. Savings plan ko revisit karna aur emergency fund strengthen karna is week ka smart move hoga.', 'Health wise, aapko digestive issues se bachne ke liye light diet follow karni chahiye. Regular walking ya yoga se stamina improve hoga aur stress level low rahega. Sleep pattern thoda irregular ho sakta hai, isliye early bedtime maintain karein.', 'Personal growth ke liye meditation aur journaling se aap apni inner feelings ko samajh sakte hain. New hobbies, especially creative arts, aapke mind ko refresh karengi. Self-reflection sessions se aap apne long-term goals ko re-align kar sakte hain.', '2026-06-16 12:27:16', 'Family members ke saath communication thoda intense ho sakta hai, lekin patience aur empathy se sab kuch smooth hoga. Elder relatives se advice lena aapke liye beneficial rahega. Ghar ke minor chores ko share karne se harmony bani rahegi.', 'Students ke liye ye week focus aur concentration ko boost karega, especially exams ki preparation mein. Group studies se concepts clear honge, lekin distractions se door rahna zaroori hai. Online courses ya workshops join karna knowledge expand karne ka acha option hai.', 'Travel plans thode last minute ho sakte hain, lekin short trips aapko refresh karenge. Safety measures follow karna aur travel insurance check karna wise decision hoga. Weekend getaway aapke stress ko relieve karegi aur creative ideas laayegi.', 'This week Meen rashi ko bahut dynamic energies milengi, jo aapke emotions aur inner thoughts ko trigger karengi. Mercury ka influence aapke communication skills ko boost karega, isliye aapko apne ideas ko clearly express karna asaan lagega. Shukra ki soft glow aapke relationships mein harmony laaye gi, lekin thoda patience rakhna zaroori hai. Mars ka minor aspect aapko thodi restlessness de sakta hai, isliye daily meditation se mind ko calm rakhein. Financial front par aapko unexpected opportunities mil sakti hain, lekin impulsive decisions se bachein. Family matters mein thoda tension ho sakta hai, lekin open dialogues se sab theek ho jayega. Overall, ye week aapke liye growth, self-awareness aur positive changes ka period hai, bas consistent effort se hi aap isse fully benefit kar sakte hain.', 'North-West', 'Har subah positive affirmation ke saath din ki shuruaat karein, kyunki aapki soch aapki reality banati hai. Consistency se hi aap apne goals ko reality mein badal sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(150, 1, '2026-06-16', 'yearly', '5', 'Purple', '10:00 AM - 12:00 PM', 'Love life mein aapko passionate moments milenge, especially single Mesh log ko exciting new connections mil sakte hain. Existing relationships mein transparency aur emotional support se bond strong hoga. Kabhi kabhi ego clash ho sakta hai, lekin patience se sab resolve ho jayega.', 'Career mein aapko naye responsibilities milengi jo aapki leadership skills ko highlight karengi. Projects mein aapki creativity aur problem‑solving ability ko saraha jayega, isliye aapko promotions ya salary increment milne ki achi sambhavna hai. Lekin, multitasking se stress ho sakta hai, isliye planning aur time management par dhyan dein.', 'Finance sector mein aapko stable income stream milega, aur long‑term investments par focus karna faydemand rahega. Unexpected expenses aane ki sambhavna hai, isliye emergency fund ready rakhein. Speculative stock market ya cryptocurrency me invest karne se pehle thorough research karein.', 'Health ke liye regular exercise aur proper sleep bahut zaroori hai, kyunki aapka energy level high rahega. Digestive issues se bachne ke liye spicy food kam karein aur balanced diet follow karein. Mental health par bhi dhyan dein, meditation ya yoga se stress ko manage kar sakte hain.', 'Personal growth ke liye aapko self‑reflection aur spiritual practices ka fayda hoga, jaise ki journaling aur meditation. New skills seekhne ke liye online courses ya workshops join kar sakte hain, jo aapke confidence ko boost karenge. Apne comfort zone se bahar nikal kar challenges accept karna aapko aur mature banayega.', '2026-06-16 12:27:23', 'Family relations mein aapko supportive environment milega, lekin kuch old misunderstandings dobara surface ho sakte hain. Patience aur samajhdari se unhe resolve karein, tabhi harmony bani rahegi. Parents ya elders ke saath quality time spend karna aapke liye emotionally rewarding hoga.', 'Education sector mein Mesh students ko focus aur determination mil raha hai, isliye exams me achhe marks milenge. New certifications ya higher studies ke liye scholarships ki opportunities explore kar sakte hain. Group studies se collaborative learning ka fayda hoga, lekin procrastination se bachein.', 'Travel plans mein aapko adventurous trips ka mauka mil sakta hai, especially solo travel se self discovery hoti hai. Short getaways se mental refreshment milega, lekin safety measures ko ignore na karein. Business trips bhi aapke professional network ko expand karenge, isliye travel ko balance karein.', 'Mesh rashi ke logon ke liye yeh saal energetic aur transformative hoga, jisme aapko naye opportunities milenge aur purane challenges ka samna karna padega. Mars aur Jupiter ki shubh yog se aapke ambition aur vision dono hi strong rahenge, isliye aap apne goals ko clearly define kar sakte hain. Professional life mein aapko promotions ya new projects mil sakte hain, lekin dhyan rahe ki overconfidence na ho. Personal relationships mein honesty aur communication kaafi important hogi, especially when misunderstandings arise. Health ke mamle mein aapko regular exercise aur balanced diet par focus karna chahiye, warna stress se kuch health issues ho sakte hain. Financially, aapke investments me growth dekhenge, lekin speculative trades se bachna hoga. Overall, yeh saal aapke liye self‑realization aur growth ka period hai, bas discipline aur positive mindset se aap sab kuch achieve kar sakte hain.', 'South-East', 'Apne goals ko daily visualize karein aur positive affirmations se din ki shuruaat karein. Consistency aur self‑discipline se aap har challenge ko easily cross kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(151, 2, '2026-06-16', 'yearly', '5', 'Maroon', '12:00 PM - 2:00 PM', 'Romantic relationships ko ek naya dynamism milega, jise aapke partner ke saath samvaad aur samajhdari se sambhaalna hoga. Aapke liye yeh samay aapke partner ke saath ek gehra emotional bond banane ka mauka hoga. Apni affection aur supportive nature ko behtar tarike se vyakt karne se aap dono ke beech ki distance kam hogi aur ek dusre ki samajh badhegi.', 'Is saal aapke career me naye mauke khulenge, especially jab aap apni mehnat ka samay par pradarshan karte hain. Aapke liye leadership roles aur managerial opportunities bhi samne aayenge, jisse aap apne skills ko refine kar sakte hain. However, aapko prashasanik karna aur samay ki maang ko samajhna hoga, taki aap apne long-term goals ko achieve kar saken.', 'Aarthik roop se aap stable aur growth ki disha me badh rahe hain, especially jab aap apne investments ko diversify karte hain. Yaha samay aapke liye savings aur long-term planning ko balance karne ka bhi avsar hai. Attention dena hoga ki aap apne expenses ko control me rakhen, taki aap future me financial security pa saken.', 'Health ke mamle me aapko thoda thandak se judne wale problems face karne pad sakte hain, par ye temporary honge. Aapko apne diet aur exercise routine par dhyan dena hoga, taki aap body ka equilibrium bana rahe. Rest aur relaxation ko bhi apne routine me shamil karna zaroori hai, taki aap mentally aur physically refreshed feel kar saken.', 'Is saal aapke liye personal growth ka ek bahut hi mahatvapurn phase hai. Aap apni strengths ko aur bhi mahatva dene lagenge, aur apni weaknesses ko improve karne ke liye proactive steps lenge. Aapki self-awareness aur self-discipline bhadhegi, jis se aap apne goals ko aasani se achieve kar sakein.', '2026-06-16 12:27:23', 'Parivarik sambandh me aapko ek nayi samajhdari milegi, especially jab aap family issues ko calmly discuss karenge. Aapke parents aur siblings ke saath aapka bond stronger hoga, jisse aapke liye support system strong hoga. Family ke saath quality time spend karna aapke liye ek emotional recharge ka source hoga.', 'Yeh samay aapke liye shiksha aur knowledge ko expand karne ke liye achha hai, especially jab aap online courses aur workshops me participate karte hain. Apne goals ko clearly define karne se aap easily focused reh sakte hain. Aapke teacher ya mentors se regular feedback lena bhi aapke learning process ko enhance karega.', 'Travel ke mamle me aapko ek adventurous aur exploratory mindset milega, jo aapko nayi jagah aur culture se rubaroo karayega. Aapko apne itinerary ko carefully plan karna hoga, taki aap apni budget aur time constraints ko manage kar saken. Yaha samay aapke liye ek refreshing break aur mental detox ka bhi mauka hoga.', 'Vrishabh rashi ke log is saal mein apni vyaktitva ko aur bhi adhik majboot karenge, kyunki Mars ka prabhav aapko ek naye urja se bharpur karega. Aapke liye yeh samay aarthik aur aatmik roop se ek saath aage badhne ka avsar lekar aayega. Parantu kuch chhote-chhote challenges bhi samne aayenge, jinke liye dhairya aur yatharthik yojana zaroori hogi. Aapke rishte mein samajhdaari aur samvaad ka mahatva badhega, jis se parivarik samvedna aur gehraayi aayegi. Yaha tak ki aapko apne karmon ki jaankari aur unka parinam bhi samajh me aayega, jo aapke aatmoshan ko sukhad banayega. Shiksha aur sikhne ki iccha bhi badhegi, jis se aap nayi skills aur gyaan prapt karenge. Ant mein, yeh saal aapke liye ek aisa samay hoga jisme aap apni personal growth ko ek naye uchaiyon tak le ja sakte hain.', 'South-West', 'Har din ek chhota se goal set karo aur usko pura karne ke liye dedicate raho. Apne aap ko positive energy se ghir le, aur har challenge ko ek learning opportunity samjho.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(152, 3, '2026-06-16', 'yearly', '45', 'White', '7:00 AM - 9:00 AM', 'Love life mein aapko kuch misunderstandings ka samna karna pad sakta hai, lekin honest communication se sab clear ho jayega. Single Mithun rashi wale logon ke liye, social gatherings aur online platforms par promising connections ban sakte hain. Jo couples hain, unke liye thoda romantic time plan karna relationship ko fresh aur exciting banaye rakhega.', 'Career ke mamle mein aapko naye responsibilities milne ki sambhavna hai, jo aapki leadership qualities ko ubhar kar dikhayengi. Saturn ki influence aapko disciplined approach adopt karne ko keh rahi hai, isliye time management par extra dhyan dein. Agar aap apne skills ko upgrade karenge, toh promotions ya salary hike ki opportunities aur bhi strong ho jayengi.', 'Financial front par aapko budgeting ka strict plan banana hoga, kyunki unnecessary expenses aapke savings ko affect kar sakte hain. Investment me cautious rahna zaroori hai, short term high-risk schemes se door rahen. Savings aur emergency fund ko strong banaye rakhna is saal ka best strategy hai.', 'Health ke liye regular exercise aur balanced diet bahut zaroori hai, varna aap thakawat mehsoos kar sakte hain. Respiratory system par dhyan dein, especially agar aap polluted areas mein rehte hain. Stress management techniques jaise meditation ya yoga adopt karne se immunity strong rahegi.', 'Personal growth ke liye aapko self-reflection aur inner work ki zaroorat hai, jo aapko mental clarity dega. New hobbies ya skill learning se aapki confidence level boost hogi. Spiritual practices jaise meditation ya journaling aapko inner peace aur direction denge.', '2026-06-16 12:27:23', 'Family relations mein thodi tension ho sakti hai, especially elder members ke saath communication gap ho sakta hai. Unke saath quality time spend karne se misunderstandings door hongi. Aapki support aur patience se family harmony phir se establish ho jayegi.', 'Students ke liye yeh saal focus aur discipline ki demand karta hai, tabhi results achhe milenge. Exams ke liye proper planning aur regular revision bahut important hai. Extra-curricular activities me participate karne se overall development improve hogi.', 'Travel plans aane wale mahino me possible hain, lekin proper research aur safety measures ko ignore na karein. Short trips se aapko mental refreshment milega, jo work stress ko kam karega. Long distance travel ke liye health insurance aur travel documents ready rakhna zaroori hai.', 'Mithun rashi ke logon ke liye yeh saal bahut dynamic rahega, jab Jupiter ka prabhav aapki soch ko aur vistar deta hai. Aapko naye mauke milenge, lekin unka fayda uthane ke liye dhairya aur samay ka sahi istemal zaroori hai. Career mein aapki mehnat rang layegi aur promotions ya naye projects aapke liye khulenge. Personal relationships mein thodi tension ho sakti hai, lekin communication se sab theek ho jayega. Health side pe aapko apne diet aur exercise routine par dhyan dena hoga, warna fatigue aana shuru ho sakta hai. Finance mein aapko investment decisions ko dhyan se evaluate karna chahiye, kyunki market volatility ho sakti hai. Overall, yeh saal aapki growth ka catalyst ban sakta hai agar aap disciplined rahenge aur positive mindset rakhenge.', 'North-West', 'Har subah apne goals ko visualize karo aur positive affirmations repeat karo; yeh aapko din bhar motivated rakhega.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(153, 4, '2026-06-16', 'yearly', '5', 'Orange', '12:00 PM - 2:00 PM', 'Romantic relationships mein deep emotional connection banega, especially for married Cancer signs. Single logon ko meaningful encounters ho sakte hain, lekin patience rakhna hoga. Communication mein honesty aur empathy se misunderstandings door hongi.', 'Career mein aapko kai naye projects mil sakte hain jo aapki capabilities ko highlight karenge. Networking events aur professional seminars aapke liye faydemand sabit honge. Lekin deadlines ko meet karne ke liye disciplined planning zaroori hai.', 'Financially aapko stable income streams milenge, lekin impulsive investments se bachein. Savings plan aur emergency fund par focus karna beneficial hoga. Long‑term assets mein thoda diversification fayda dega.', 'Health sector mein aapko thodi fatigue feel ho sakti hai, isliye proper sleep schedule follow karein. Yoga aur meditation se mental stress kam hoga. Digestive system ko strong rakhne ke liye light diet adopt karein.', 'Personal growth ke liye meditation aur journaling aapko self‑awareness badhane mein madad karega. New hobbies jaise painting ya music explore karne se creative energy release hogi. Spiritual practices aapko inner peace denge.', '2026-06-16 12:27:23', 'Family relations mein harmony ka mahol banega, especially with aging parents. Ghar ke decisions mein sabki opinion ko respect karna zaroori hai. Kuch minor disputes ho sakte hain, lekin patience se sab solve ho jayenge.', 'Students ke liye learning curve thoda steep ho sakta hai, lekin consistent study routine se results improve honge. Practical applications aur group studies se concepts clear honge. Exams ke liye early revision aur mock tests faydemand rahenge.', 'Travel plans mein short trips aur weekend getaways aapko rejuvenate karenge. Domestic destinations par focus karna zyada feasible hoga. Travel ke dauran health precautions lena na bhoolen, especially diet aur rest ka dhyan rakhein.', 'Cancer sign ke logon ke liye yeh saal emotional depth aur practical growth ka perfect blend lekar aata hai. Jupiter ki positive drishti se aapke relationships aur career dono mein naye mauke khulenge. Apni intuition par vishwas rakhein, kyunki decisions aapko aage le jayenge. Financial stability ka chance hai, lekin unnecessary kharchon se bachaav zaroori hai. Health wise, regular exercise aur balanced diet aapko energetic rakhegi. Family ke saath samay bitane se emotional bond mazboot hoga. Overall, self‑awareness aur disciplined approach se aap is saal ko safalta se poora kar sakte hain.', 'North', 'Apni instincts par bharosa rakho, kyunki wo aapko sahi raaste dikhayengi. Har din thoda gratitude practice karo, success automatically attract hogi.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(154, 5, '2026-06-16', 'yearly', '2', 'Pink', '7:00 AM - 9:00 AM', 'Love life mein aapke emotions gehra ho jayenge, aur partners ke saath bonding strong hogi. Compatibility aur mutual respect ke saath aap stability feel karenge. Singles ke liye new connections aapko intriguing opportunities de sakte hain. Overall, ek healthy emotional environment ka experience hoga.', 'Career mein aapko creative projects aur leadership roles mein success milegi. New collaborations aapke growth ko accelerate karenge, especially tech ya digital fields mein. Hard work aur dedication se promotions ya salary hikes ki sambhavnayein barhengi. Bonus points if you explore entrepreneurship or consulting.', 'Financially, 2024 mein aapko investment opportunities milne ki sambhavnayein hai. Smart savings aur diversified portfolio aapko long-term stability provide karega. Unexpected expenses ho sakte hain; hence, contingency planning essential hai. Small wins and disciplined budgeting will bring overall good results.', 'Health wise aapko thoda fatigue feel ho sakta hai, especially mentally. Regular exercise aur balanced diet se aap energy levels maintain kar sakte hain. Stress ko manage karne ke liye mindfulness practices ka use karein. Small health check-ups se potential issues early detect ho sakte hain.', 'Personal growth ke liye aapko self-reflection aur skill development par focus karna hoga. New hobbies aur learning platforms aapko fresh perspective denge. Mindset shift towards growth mindset will empower you to overcome obstacles. Regular journaling se clarity aur motivation milegi.', '2026-06-16 12:27:23', 'Family relations mein aapko patience aur understanding ki jarurat hogi. Communicate openly to avoid misunderstandings. Family support system will strengthen during this period. Small family gatherings can bring joy and bonding.', 'Education-wise, 2024 aapko higher learning ya certification courses pursue karne ka mauka dega. Dedicated study hours aur disciplined learning schedule se success milega. Group studies ya peer interactions will enhance knowledge retention. Online resources can supplement traditional learning methods.', 'Travel plans will be exciting, especially domestic trips. Cultural experiences and exposure to new environments will broaden horizons. However, plan logistics early to avoid last-minute hassles. Travel with friends or family can create memorable experiences.', '2024 ka saal aapke liye naye mauke aur challenges ka saath lekar aayega, Singh rashi ke liye yeh ek transformative period hoga. Aapki karmic energy strong hogi aur aapko apne goals ke liye focused rehna hoga. Financial opportunities aayengi, lekin unhe wisely manage karna zaroori hai. Love life mein emotional depth aur trust build karne ka perfect time hai, especially long-term relationships ke liye. Health aspect mein aapko stress management par focus karna hoga, simple yoga aur meditation se fayda milega. Family dynamics mein subtle changes aayenge, jisme communication key role play karegi. Overall, balance aur self-discipline aapko success aur harmony dono laayenge.', 'South', 'Apne goals ko clearly define karo, aur unke liye step-by-step plan banao. Khud ki potential ko believe karo, because confidence is your greatest asset.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(155, 6, '2026-06-16', 'yearly', '6', 'Red', '7:00 AM - 9:00 AM', 'Love life mein single Virgo ko meaningful connections mil sakte hain, jab wo apni true self ko express karenge. Married couples ko thoda extra communication ki zarurat hogi, especially emotional needs ko articulate karna. Overthinking se bachne ke liye mindfulness practice karein, tabhi relationship harmony bani rahegi.', 'Career sector mein aapko promotions aur recognition milne ki sambhavna hai, especially second half of the year. Projects jo aap lead karenge, unmein aapki analytical skill shine karegi, lekin deadlines ko meet karne ke liye time management par dhyan dena hoga. Networking events aur professional workshops aapke liye growth ka catalyst banenge, isliye actively participate karein.', 'Finance mein aapko savings ka habit aur bhi strong karna hoga, kyunki unexpected expenses aa sakte hain. Investment decisions mein research aur professional advice lein, speculative trades se door rahen. Mid-year tak aapko extra income sources mil sakte hain, lekin unke tax implications ko bhi dhyan mein rakhein.', 'Health front pe aapko regular exercise routine maintain karna zaroori hai, yoga ya brisk walking best rahega. Digestive issues thode time ke liye ho sakte hain, isliye spicy food se bachkar balanced diet lein. Stress management ke liye meditation aur deep breathing exercises daily practice karein.', 'Personal growth ke liye aapko apni perfectionist tendencies ko thoda soften karna hoga, tabhi aap new experiences enjoy kar paenge. Meditation aur journaling se inner clarity milegi, jo decision making ko aasaan banayegi. Self‑care routines ko daily schedule mein include karne se confidence boost hoga.', '2026-06-16 12:27:23', 'Family relationships mein aapko patience aur empathy dikhani hogi, especially elder members ke saath. Home responsibilities ko share karne se harmony bani rahegi, aur aapko mental peace milegi. Family gatherings mein aapki practical advice sabko pasand aayegi, isliye apni insights share karein.', 'Education ya skill development ke liye online courses aur certifications aapke liye beneficial rahenge. Learning curve thoda steep ho sakta hai, lekin consistent effort se aap mastery achieve karenge. Exams ya assessments ke liye early preparation aur mock tests se confidence badega.', 'Travel plans mein short trips domestic destinations ke liye best rahenge, especially nature retreats. Long distance ya international travel ke liye planning early start karein, kyunki logistics thode complex ho sakte hain. Travel ke dauran health precautions aur travel insurance ko ignore na karein.', 'Virgo rashi ke logon ke liye yeh saal self‑reflection aur practical growth ka hai. Saturn ka influence aapke discipline ko aur majboot banayega, lekin flexibility ki kami se kabhi kabhi stress ho sakta hai. Mercury retrograde periods mein communication pe dhyan dena zaroori hai, warna misunderstandings ho sakti hain. Career mein naye opportunities aayengi, lekin unhe grab karne ke liye aapko apni perfectionist nature ko thoda relax karna padega. Financially aapko cautious approach rakhna hoga, especially speculative investments se door rehna. Relationships mein honesty aur emotional openness se bonding strong hogi, lekin over‑analysis se conflicts ho sakte hain. Health ke mamle mein routine exercise aur balanced diet se aap apni stamina bana sakte hain, aur stress management techniques ka istemal bahut faydemand rahega.', 'South-West', 'Apni perfection ko productive energy mein badle, har choti success ko celebrate karein. Aaj ka din aapko growth ki nayi raah dikhayega, bas positive mindset banaye rakhein.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(156, 7, '2026-06-16', 'yearly', '3', 'Orange', '12:00 PM - 2:00 PM', 'Love life mein aapko emotional stability milegi, especially single logon ke liye koi promising connection aa sakta hai. Existing relationships mein communication improve hogi, lekin thoda space dena bhi zaroori hai. Venus ki positive influence se romance aur companionship dono hi strong rahenge.', 'Career mein aapko naye responsibilities milengi, jo aapki leadership qualities ko highlight karegi. Office politics thodi intense ho sakti hai, lekin aapki diplomatic nature se sab theek ho jayega. Networking events aur professional workshops se aapki visibility badhegi, isliye actively participate karein.', 'Finance mein aapko savings par dhyan dena hoga, aur impulsive spending se bachna hoga. Long term investments jaise mutual funds ya SIP aapke liye fayde mand sabit ho sakte hain. Unexpected expenses ho sakte hain, isliye emergency fund ready rakhein.', 'Health perspective se aapko regular exercise aur balanced diet par focus karna hoga, warna fatigue ho sakta hai. Stress management techniques jaise meditation ya yoga aapke liye beneficial rahenge. Seasonal allergies ka dhyan rakhein, especially monsoon ke dauran.', 'Personal growth ke liye aapko self‑reflection aur inner work karna zaroori hai, meditation aapko clarity degi. New hobbies ya skill development se aapka confidence boost hoga. Spiritual practices jaise mantra chanting aapko mental peace degi.', '2026-06-16 12:27:23', 'Family relations mein harmony bani rahegi, lekin older members ki health par dhyan dena zaroori hai. Home responsibilities share karne se sabka stress kam hoga. Family gatherings se emotional bonding strong hogi, isliye outings plan karein.', 'Education ke field mein students ko focus aur consistency ki zaroorat hai, short term goals set karein. Online courses aur certifications se knowledge enhance hogi. Teachers aur mentors ke guidance ko value karein, kyunki unka feedback aapko aage le jayega.', 'Travel plans me aapko short trips ka maza aayega, especially weekend getaways. Long distance travel ke liye proper planning aur health precautions zaroori hai. Travel se aapko new perspectives milenge jo personal growth me help karenge.', 'Tula rashi ke logon ke liye 2023 ek transformative saal hoga, jahan aapko kayi naye mauke milenge. Jupiter ki shukra par drishti se aapke relationships aur career dono mein positivity aayegi. Saturn ki prabhav se aapko discipline aur patience ki zaroorat padegi, lekin ye aapke growth ko boost karega. Mercury ki retrograde se communication mein thodi dikkat ho sakti hai, isliye decisions lene se pehle double-check karna zaroori hai. Dhruv nakshatra ki shakti se aapki creative instincts strong rahengi, jo aapko alag projects mein aage badhne mein madad karegi. Financial planning mein thoda cautious rehna hoga, lekin long term investments aapke liye fayde mand sabit honge. Overall, yeh saal aapke liye self‑realization aur balanced life ki taraf ek strong push hoga.', 'North-East', 'Har roz thoda samay apne goals par visualize karne ke liye nikaalein, isse motivation high rahegi. Challenges ko opportunities ke roop mein dekhein, tabhi aap unstoppable banenge.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent');
INSERT INTO `horoscopes` (`id`, `zodiac_id`, `date`, `type`, `lucky_number`, `lucky_color`, `lucky_time`, `love`, `career`, `money`, `health`, `personal_growth`, `created_at`, `family`, `education`, `travel`, `overview`, `lucky_direction`, `tip_of_the_day`, `love_status`, `career_status`, `health_status`, `finance_status`, `personal_growth_status`) VALUES
(157, 8, '2026-06-16', 'yearly', '21', 'Blue', '7:00 AM - 9:00 AM', 'Love life mein aapko deeper emotional connection feel hoga, especially if you are in a committed relationship. Single Scorpios ke liye Jupiter ki positive drishti se meaningful relationships ban sakti hain. Old flames ya unresolved issues surface ho sakte hain, lekin mature dialogue se sab clear ho jayega.', 'Career ke mamle mein 2024 me aapko promotion ya naye project milne ki strong possibility hai. Mars ki shakti aapko dynamic aur decisive banayegi, jis se aap leadership roles mein shine karenge. Lekin office politics se bachne ke liye patience aur transparent communication zaroori hai.', 'Finance sector mein aapke investments ko stable returns milenge, especially in real estate and mutual funds. Impulse buying se bachne ke liye budget plan banaye aur har mahine savings ko track karein. Unexpected expenses aane par emergency fund ka use smartly karein.', 'Health ke liye regular yoga aur meditation aapke stress levels ko control karenge. Digestive system thoda sensitive ho sakta hai, isliye spicy food se bachna chahiye. Seasonal flu se bachne ke liye vitamin C aur proper sleep routine maintain karein.', 'Personal growth ke liye meditation aur self‑reflection ka routine adopt karna beneficial rahega. New hobbies jaise painting ya music aapke inner creativity ko unleash karenge. Self‑discipline aur goal setting se aap apni aspirations ko clearly define kar sakte hain.', '2026-06-16 12:27:23', 'Family relationships mein aapko supportive environment milega, lekin elder members ki health par dhyan dena zaroori hai. Home responsibilities share karne se harmony bani rahegi. Family gatherings aur traditions ko celebrate karna emotional bonding ko strong karega.', 'Education ke field mein students ko analytical skills improve karne ka mauka milega, especially in research projects. Online courses aur certifications aapki skill set ko upgrade karenge. Exams ke liye consistent study schedule aur revision plan follow karna zaruri hai.', 'Travel sector mein short trips aur weekend getaways aapke stress ko kam karenge. International travel ke liye proper documentation aur health safety measures follow karein. Business trips me networking opportunities mil sakti hain, isliye prepared rahen.', 'Scorpio rashi ke liye 2024 ka saal transformation ka hai, jo aapke andar ki gehri soch ko ubharne ka mauka dega. Jupiter ki drishti aapke career aur personal growth par positively shine karegi, isliye aapko nayi responsibilities milne ki sambhavna hai. Saturn ki prabhav se kuch challenges aayenge, lekin aapki perseverance se aap unhe aasani se handle kar sakte hain. Relationships mein emotional depth badhegi, aur aapko apne partner ya close friends ke saath gehri baatein karne ka mauka milega. Health ke mamle mein, aapko regular exercise aur proper diet se immunity strong rakhni hogi. Financial sector mein unexpected income sources aa sakte hain, lekin impulsive spending se bachna zaroori hai. Overall, ye saal aapke liye growth, self‑realization aur stability ka balanced mix lekar aayega.', 'South', 'Har subah positive affirmation ke saath start karein, kyunki aapki soch hi aapki reality banati hai. Consistency se hi aap apne goals ko manifest kar paenge.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(158, 9, '2026-06-16', 'yearly', '45', 'Yellow', '6:00 AM - 8:00 AM', 'Love life mein singles ko interesting connections mil sakte hain, especially through social events ya online platforms. Couples ko apne partner ke saath deeper emotional bonding ke liye honest conversations zaroori hongi. Thodi jealousy ya misunderstandings ho sakti hain, lekin patience aur mutual respect se sab theek ho jayega.', 'Career ke mamle mein aapko promotions ya naye responsibilities milne ke strong signs hain. Jupiter ki blessings se aapki creativity aur strategic thinking bahut enhance hogi, jo aapko leadership roles ke liye eligible banayegi. Lekin, office politics se bachne ke liye aapko apni boundaries clear rakhni hongi aur deadlines ko strictly follow karna hoga.', 'Financially aapke liye savings ka period hai, isliye unnecessary kharchon se bachein. Investments in mutual funds ya SIPs aapke long‑term wealth ko grow karenge, lekin high‑risk stocks se thoda door rahna behtar hai. Unexpected expenses aane ki sambhavna hai, isliye emergency fund ready rakhein.', 'Health sector mein aapko apni diet par dhyan dena hoga, especially processed foods ko avoid karna. Regular exercise, yoga aur meditation se stress levels kam honge aur energy level maintain rahega. Seasonal flu ya minor infections se bachne ke liye immunity boosters jaise ginger tea ya tulsi ka sevan karein.', 'Personal growth ke liye aapko self‑reflection aur spiritual practices ko apnana chahiye, jaise meditation ya journaling. New hobbies ya skill development aapko confidence boost denge aur aapke outlook ko broaden karenge. Apne comfort zone se bahar nikal kar challenges accept karne se aapki resilience strong hogi.', '2026-06-16 12:27:23', 'Family relations mein aapko seniors ya elders se valuable guidance mil sakti hai, jo aapke decisions ko influence karegi. Younger members ke saath quality time spend karne se emotional bonding aur strong hogi. Kuch minor misunderstandings ho sakti hain, lekin patience se sab resolve ho jayega.', 'Students ke liye yeh saal exams aur competitive tests mein achha performance dikhane ka hai. Focused study schedule aur proper revision techniques se results improve honge. Learning ke liye online courses ya workshops join karna beneficial rahega, especially in technology or creative fields.', 'Travel sector mein short trips ya weekend getaways aapke liye refreshing honge, especially hill stations ya spiritual destinations. Business trips bhi aane ki sambhavna hai, jo aapke professional network ko expand karegi. Long‑duration travel planning ke liye financial budgeting pe dhyan dena zaroori hai.', 'Sagittarius (Dhanu) rashi ke liye yeh saal kaafi dynamic rahega, jisme aapko naye mauke milenge aur kuch challenges bhi aayenge. Jupiter ki strong position aapke vikas ko accelerate karegi, isliye aap apne goals ko clear vision ke saath pursue karenge. Jo projects aapne pehle sochhe the, unka implementation ab shuru ho sakta hai aur success ki sambhavnayein high hain. Personal relationships mein thoda emotional intensity aayegi, lekin aapki communication skills isko balance karengi. Health-wise aapko apni routine ko disciplined rakhna hoga, varna fatigue ho sakti hai. Financially aapko savings aur investments par dhyan dena chahiye, kyunki unpredictable expenses aa sakte hain. Overall, yeh saal aapke liye growth, learning aur self‑realization ka period hoga, bas thoda patience aur focus banaaye rakhein.', 'West', 'Har subah positive affirmation ke saath din ki shuruat karein, kyunki aapki soch aapki reality ko shape karti hai. Consistency aur self‑discipline se aap koi bhi goal aasani se achieve kar sakte hain.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(159, 10, '2026-06-16', 'yearly', '36', 'Purple', '10:00 AM - 12:00 PM', 'Love life mein aapko peace aur harmony milega. Existing relationships will strengthen, especially with understanding and mutual respect. New love interests can bring fresh excitement, but trust is key.', 'Career ki duniya me aapko naye opportunities milenge, especially leadership roles me. Aapki mehnat aur dedication logo ko impress karegi. Aapko apne skills ko upgrade karne ka avsar milega, jo long term me fayda karega.', 'Finance wise, short-term gains promise, but long-term stability needs careful planning. Investments in mutual funds or real estate could be fruitful. Aapko unnecessary expenses se bachna hoga.', 'Health ke maamle me aapko thoda rest ki zaroorat hogi. Regular exercise and balanced diet se aap energetic rahenge. Stress levels ko manage karne ke liye meditation try karein.', 'Personal growth ke liye self-reflection important hai. Aapke spiritual growth me progress hoga, especially if you practice daily rituals. Positive mindset se aap challenges ko asaani se face karenge.', '2026-06-16 12:27:23', 'Family dynamics mein harmony aayegi. Parents ke saath communication better hoga, especially in resolving past misunderstandings. Family gatherings will be joyous and supportive.', 'Education ke maamle me aapko further studies ki taraf attract feel hoga. Course or certification ke options explore karna behtar hoga. Learning new skills will boost confidence.', 'Travel plans to be exciting, especially short trips to cultural sites. Time management is key to balance work and leisure. New experiences will broaden perspective and creativity.', 'Is saal Makar rashi wale logo ke liye kuch badlaav ki behtarein mauke aane wale hain. Grih prabhav se aapke jeevan mein kuch anishchitata aayegi lekin dhairya se aap usse paar kar lenge. Samay ke saath aapke rishte gehre honge aur samajh badhegi. Kaam ke maamle mein aapko naye zimmedariyon ka samna karna padega, lekin yeh aapko aur majboot banayenge. Aapki kalpana aapko creative projects mein success dilayegi. Health mein thoda dhyaan rakhna hoga, khaaskar vyayam aur diet par. Financial aspect mein aapko thoda patience rakhna hoga, lekin fayde aane ki sambhavnayein bhi hain.', 'East', 'Apne goals ko clear rakh kar kaam karo, har mushkil ko ek step samajh kar aage badho. Positivity aur hard work ka combination success ki guarantee hai.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(160, 11, '2026-06-16', 'yearly', '4', 'White', '6:00 AM - 8:00 AM', 'Love life mein excitement ka level high rahega, especially singles ke liye new connections ka chance hai. Existing relationships mein emotional bonding deep hogi, lekin thodi jealousy se bachne ke liye open communication zaroori hai. Venus ki positive aspect se romance aur mutual understanding dono hi flourish honge.', 'Career mein aapko promotions ya naye projects ka invitation mil sakta hai, jo aapki skills ko highlight karega. Saturn ki influence se discipline aur hard work ki zarurat hogi, isliye time management par dhyan dein. Networking events aur professional seminars attend karne se aapke growth ke chances aur bhi strong ho jayenge.', 'Finance sector mein aapko stable income streams milenge, lekin extra investments ke liye thorough research karna zaroori hai. Unexpected expenses aane ki sambhavna hai, isliye emergency fund ready rakhein. Savings aur long‑term planning par dhyan dene se aapka financial health strong rahega.', 'Health ke maamle mein aapko stamina mein thoda fluctuation feel ho sakta hai, isliye regular exercise routine zaroori hai. Digestive issues se bachne ke liye diet mein fiber rich foods shamil karein. Mental health ke liye meditation aur breathing exercises daily routine ka hissa banayein.', 'Personal growth ke liye self‑reflection aur spiritual practices aapko bahut help karenge, especially meditation aur journaling. New hobbies ya skill development se aapki confidence level boost hogi. Challenges ko accept karke aap apne inner strength ko aur bhi majboot bana sakte hain.', '2026-06-16 12:27:23', 'Family relations mein thodi misunderstandings ho sakti hain, lekin patience aur empathy se sab resolve ho jayega. Elder family members ki guidance aapko important decisions mein help karegi. Family gatherings aur celebrations se emotional bonding aur strong hogi.', 'Students ke liye exams aur competitive tests ka pressure thoda high rahega, lekin disciplined study schedule se acchi results mil sakti hain. Online courses aur skill‑based learning aapko aage badhne mein help karegi. Teachers aur mentors ke suggestions ko seriously lein, kyunki wo aapke growth ke liye beneficial honge.', 'Travel plans mein short trips aur weekend getaways ka scope hai, jo aapko refresh karenge. Long‑distance travel ke liye proper planning aur documentation ready rakhna zaroori hai. Travel during auspicious dates se safety aur smooth experiences milenge.', 'Kumbh rashi ke logon ke liye 2024 ek transformative saal hoga, jisme aapko naye mauke milenge aur kuch purane patterns ko todna padega. Jupiter ki shukra ke saath milne se aapki creativity aur social networking skills kaafi tezz ho jayengi. Dhanur rashi ki prabhav se aapko career mein growth ke liye strong push mil sakta hai, lekin dhairya rakhna zaroori hai. Grihasti mein thode tensions ho sakte hain, par communication se sab theek ho jayega. Health wise, aapko apne routine mein yoga aur meditation ko include karna chahiye, taaki stress kam ho. Financial sector mein investments ka samay aapke liye favorable hai, lekin impulsive decisions se bachein. Overall, yeh saal aapko self‑realization aur outer success dono hi provide karega, bas positive mindset banaye rakhein.', 'South-East', 'Har subah gratitude ka ek pal nikal kar din ki shuruaat karein, isse positivity attract hogi. Apne goals ko visualize karte hue consistent action lete rahen, success aapke kadam chumegi.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(161, 12, '2026-06-16', 'yearly', '2', 'Pink', '6:00 AM - 8:00 AM', 'Pyaar ki baat karein toh Venus aapke chart mein warm vibes la rahi hai, isliye existing relationships mein deeper understanding develop hogi. Single Meen rashi wale logon ko koi meaningful connection mil sakta hai, bas apni intuition par trust karein. Kabhi kabhi emotional ups and downs aayenge, lekin communication se sab resolve ho jayega.', 'Jupiter ki shukravaan shakti aapke professional life mein expansion la rahi hai, isliye promotions ya naye projects milne ki sambhavna hai. Saturn ke retrograde se thodi delays ho sakti hain, lekin patience rakhne se aap har challenge ko successfully handle karenge. Networking aur collaborative work aapke liye beneficial honge, isliye team meetings mein actively participate karein.', 'Financially aapke liye steady income streams ban rahe hain, lekin unnecessary luxuries par kharch karna avoid karein. Investments in mutual funds ya long‑term savings plans aapke liye safe honge. Unexpected expenses aane ki sambhavna hai, isliye emergency fund ready rakhein.', 'Health perspective se aapko digestive system par dhyan dena chahiye, kyunki Pisces ka watery nature acidity ka risk badhata hai. Regular exercise, especially swimming ya yoga, aapke stamina ko boost karega. Stress management ke liye meditation aur deep breathing techniques adopt karna faydemand rahega.', 'Personal growth ke liye aapko apni spiritual practices ko deep karna hoga, jaise ki mantra chanting ya guided meditation. Self‑reflection journals aapko apne emotions ko samajhne mein madad karenge. New hobbies ya creative pursuits aapke inner artist ko awaken karenge.', '2026-06-16 12:27:23', 'Family relationships mein aapko patience aur empathy dikhani hogi, especially elder members ke saath. Home responsibilities ko balance karna zaruri hai, taki sabko support mil sake. Festivals aur gatherings aapke liye bonding ka strong platform banenge.', 'Students ke liye yeh saal concentration aur consistency ki demand karta hai, isliye study schedule ko strict rakhein. Jupiter ki supportive influence se higher education ya competitive exams mein achhe results mil sakte hain. Group studies aur mentorship aapko concepts clear karne mein help karenge.', 'Travel plans favorable hain, especially spiritual retreats ya coastal destinations jo aapke Pisces nature ko suit karte hain. Short trips se mental refreshment milega, lekin long trips ke liye proper planning zaruri hai. Travel expenses ko pre‑budget karne se financial stress kam rahega.', 'Meen rashi ke logon ke liye yeh saal emotional depth aur spiritual growth ka hai, jisme aapko apne intuition par bharosa karna hoga. Jupiter ki strong position aapke andar optimism aur positivity ko barhati hai, lekin Saturn ka retrograde influence kabhi‑kabhi hesitation create kar sakta hai. Yeh varsh aapke relationships mein clarity lane ka mauka deta hai, especially jab aap apni feelings ko articulate karenge. Career front par naye opportunities aayengi, lekin unhe grab karne ke liye aapko thoda extra effort dena padega. Financially aapko disciplined budgeting ki zarurat hogi, warna impulsive spending aapke savings ko affect kar sakti hai. Health wise, mind‑body balance maintain karna zaruri hai, isliye yoga aur meditation ko daily routine ka hissa banayein. Overall, yeh saal aapko apni inner strength discover karne aur life ko ek nayi direction dene ka chance dega.', 'North', 'Apni intuition ko guide banayein aur har din thoda sa gratitude practice karein. Challenges ko growth ke stepping stones samjhe, tabhi aap apni true potential tak pahunch payenge.', 'Excellent', 'Good', 'Average', 'Good', 'Excellent'),
(162, 1, '2026-07-21', 'daily', '8', 'Turquoise', '10:00 AM - 12:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Mesh rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(163, 2, '2026-07-21', 'daily', '36', 'Yellow', '12:00 PM - 2:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Vrishabh rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(164, 3, '2026-07-21', 'daily', '7', 'Turquoise', '7:00 AM - 9:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Mithun rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(165, 4, '2026-07-21', 'daily', '8', 'Silver', '2:00 PM - 4:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Kark rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South-West', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(166, 5, '2026-07-21', 'daily', '3', 'Pink', '6:00 AM - 8:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Singh rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(167, 6, '2026-07-21', 'daily', '2', 'Pink', '6:00 AM - 8:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Kanya rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(168, 7, '2026-07-21', 'daily', '9', 'Blue', '12:00 PM - 2:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Tula rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(169, 8, '2026-07-21', 'daily', '11', 'Green', '6:00 PM - 8:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Vrishchik rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(170, 9, '2026-07-21', 'daily', '4', 'Yellow', '6:00 AM - 8:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Dhanu rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(171, 10, '2026-07-21', 'daily', '4', 'Yellow', '6:00 AM - 8:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Makar rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-West', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(172, 11, '2026-07-21', 'daily', '21', 'Red', '2:00 PM - 4:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Kumbh rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(173, 12, '2026-07-21', 'daily', '36', 'Blue', '12:00 PM - 2:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-21 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Meen rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(174, 1, '2026-07-22', 'daily', '4', 'Golden', '8:00 AM - 10:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Mesh rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(175, 2, '2026-07-22', 'daily', '11', 'Turquoise', '12:00 PM - 2:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Vrishabh rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(176, 3, '2026-07-22', 'daily', '8', 'Purple', '8:00 AM - 10:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Mithun rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good');
INSERT INTO `horoscopes` (`id`, `zodiac_id`, `date`, `type`, `lucky_number`, `lucky_color`, `lucky_time`, `love`, `career`, `money`, `health`, `personal_growth`, `created_at`, `family`, `education`, `travel`, `overview`, `lucky_direction`, `tip_of_the_day`, `love_status`, `career_status`, `health_status`, `finance_status`, `personal_growth_status`) VALUES
(177, 4, '2026-07-22', 'daily', '21', 'Orange', '6:00 PM - 8:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Kark rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(178, 5, '2026-07-22', 'daily', '21', 'Yellow', '2:00 PM - 4:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Singh rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(179, 6, '2026-07-22', 'daily', '6', 'Yellow', '12:00 PM - 2:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Kanya rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South-West', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(180, 7, '2026-07-22', 'daily', '9', 'Red', '4:00 PM - 6:00 PM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Tula rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-West', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(181, 8, '2026-07-22', 'daily', '36', 'Maroon', '8:00 AM - 10:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Vrishchik rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-West', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(182, 9, '2026-07-22', 'daily', '21', 'Maroon', '7:00 AM - 9:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Dhanu rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'West', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(183, 10, '2026-07-22', 'daily', '5', 'White', '6:00 AM - 8:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Makar rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'South-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(184, 11, '2026-07-22', 'daily', '6', 'Maroon', '7:00 AM - 9:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Kumbh rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'West', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good'),
(185, 12, '2026-07-22', 'daily', '11', 'Purple', '8:00 AM - 10:00 AM', 'Rishton mein meethas aur pyaar badhega is samay. Apne partner ke saath khule dil se baat karein. Naye relationships ke liye bhi yah samay shubh hai.', 'Kaam mein naye avsar milenge aur mehnat zaroor rang laayegi. Apne superiors ke saath achha relationship banaye rakhen. Naye projects mein hissa lene ka yahi sahi waqt hai.', 'Aarthik sthiti theek rahegi, fijul kharch se bachen. Bachat par dhyan den aur long-term investments ke baare mein sochen. Kisi bhi bade financial decision se pehle soch-samajhkar kadam uthayen.', 'Niyamit vyayam aur sahi khaan-paan par dhyan dena zaroori hai. Mental health ka khayal rakhein, meditation faydemand rahegi. Neend poori lena sehat ke liye atyant zaroori hai.', 'Naye skills seekhne ka yahi sahi samay hai. Apni personality develop karne par focus karen. Books padhna aur naye log se milna faydemand rahega.', '2026-07-22 18:30:00', 'Parivar ke saath quality time bitayein aur rishte mazboot banayein. Ghar mein sukh-shanti banaye rakhna aapki zimmedari hai. Bade-buzurgon ka aashirwad lena na bhoolen.', 'Padhai mein concentration badhega aur mehnat rang laayegi. Naye courses ya certifications ke baare mein sochen. Teachers aur mentors ka margdarshan lena faydemand rahega.', 'Chhota safar labhdayak ho sakta hai is samay. Kisi naye jagah jaane ka plan ban sakta hai. Safar ke dauran naye logon se milne ka mauka milega.', 'Meen rashi ke liye today ka samay ek nayi shuruaat lekar aa raha hai. Graha sthiti aapke paksh mein hai aur aapko positive energy milegi. Apne kaam par focus rakhen aur din ka bhar pur upyog karen. Is samay aapko apni strengths par bharosa rakhna hoga. Rishton mein meethas badhegi aur parivar ka saath milega. Swasth rehna sabse zaroori hai, khyaal rakhen apna. Har mushkil ke baad ek naya sawera aata hai, hausla rakhen.', 'North-East', 'Har din ek nayi cheez seekhne ki koshish karein aur apne sapnon ki taraf ek kadam zaroor uthayen. Positive soch hi aapki sabse badi taqat hai.', 'Good', 'Good', 'Average', 'Average', 'Good');

-- --------------------------------------------------------

--
-- Table structure for table `live_comments`
--

CREATE TABLE `live_comments` (
  `id` bigint(20) NOT NULL,
  `stream_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `live_gifts`
--

CREATE TABLE `live_gifts` (
  `id` bigint(20) NOT NULL,
  `stream_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `astrologer_id` bigint(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `wallet_txn_id` bigint(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `live_likes`
--

CREATE TABLE `live_likes` (
  `id` bigint(20) NOT NULL,
  `stream_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `live_streams`
--

CREATE TABLE `live_streams` (
  `id` bigint(20) NOT NULL,
  `astrologer_id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `stream_key` varchar(100) NOT NULL,
  `status` enum('live','ended') DEFAULT 'live',
  `viewer_count` int(11) DEFAULT 0,
  `total_likes` int(11) DEFAULT 0,
  `started_at` datetime DEFAULT current_timestamp(),
  `ended_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `live_streams`
--

INSERT INTO `live_streams` (`id`, `astrologer_id`, `title`, `stream_key`, `status`, `viewer_count`, `total_likes`, `started_at`, `ended_at`, `created_at`) VALUES
(176, 61, 'Live', 'live_61_1784349904558', 'ended', 0, 0, '2026-07-18 10:15:04', '2026-07-18 10:15:15', '2026-07-18 10:15:04'),
(177, 61, 'Live', 'live_61_1784363647538', 'ended', 0, 0, '2026-07-18 14:04:07', '2026-07-18 14:04:23', '2026-07-18 14:04:07'),
(178, 65, 'Live', 'live_65_1784656850305', 'ended', 0, 0, '2026-07-21 23:30:50', '2026-07-21 23:37:12', '2026-07-21 23:30:50');

-- --------------------------------------------------------

--
-- Table structure for table `live_viewers`
--

CREATE TABLE `live_viewers` (
  `id` bigint(20) NOT NULL,
  `stream_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `joined_at` datetime DEFAULT current_timestamp(),
  `left_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `live_viewers`
--

INSERT INTO `live_viewers` (`id`, `stream_id`, `user_id`, `joined_at`, `left_at`, `is_active`, `created_at`) VALUES
(169, 176, 28, '2026-07-18 10:15:09', '2026-07-18 10:15:16', 0, '2026-07-18 10:15:09'),
(170, 177, 28, '2026-07-18 14:04:12', '2026-07-18 14:04:24', 0, '2026-07-18 14:04:12'),
(171, 178, 26, '2026-07-21 23:30:52', '2026-07-21 23:30:58', 0, '2026-07-21 23:30:52');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `executed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `name`, `executed_at`) VALUES
(2, '002_create_app_contents.js', '2026-05-23 06:44:18'),
(3, '003_create_banners.js', '2026-05-23 06:44:18'),
(4, '001_users.js', '2026-05-23 09:10:58'),
(5, '004_create_zodiac_signs.js', '2026-05-23 12:12:35'),
(6, '005_create_horoscopes.js', '2026-05-23 12:12:36'),
(7, '006_orders.js', '2026-05-24 17:17:44'),
(8, '007_wallet.js', '2026-05-24 17:17:45'),
(9, '008_notifications.js', '2026-05-24 17:17:45'),
(10, '009_astrologers.js', '2026-05-24 19:20:49'),
(11, '010_create_favorites_table.js', '2026-05-24 19:41:47');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `astrologer_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `target_type` enum('all','users','astrologers','specific_user','specific_astrologer') DEFAULT NULL,
  `sent_count` int(11) DEFAULT 0,
  `sent_by_admin` bigint(20) DEFAULT NULL,
  `type` enum('offer','message','consultation','system','push') DEFAULT NULL,
  `status` enum('read','unread') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `astrologer_id`, `title`, `message`, `image`, `target_type`, `sent_count`, `sent_by_admin`, `type`, `status`, `created_at`) VALUES
(1, NULL, 32, 'Offer', '50% OFF on first chat', NULL, 'specific_astrologer', 0, NULL, 'offer', 'read', '2026-05-24 17:19:33'),
(2, 13, 32, 'Consultation Completed', 'Your consultation completed successfully', NULL, 'specific_astrologer', 0, NULL, 'consultation', 'unread', '2026-05-24 17:19:33'),
(3, 1, 32, 'Wallet Added', '₹500 added successfully', NULL, 'specific_astrologer', 0, NULL, 'system', 'read', '2026-05-24 17:19:33'),
(4, NULL, 34, 'Offer', '60% OFF on first chat', NULL, 'specific_astrologer', 0, NULL, 'offer', 'read', '2026-05-24 17:19:33'),
(5, NULL, 32, 'Offer', '50% OFF on first chat', NULL, 'specific_astrologer', 0, NULL, 'offer', 'read', '2026-05-24 17:19:33');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `order_id` varchar(100) DEFAULT NULL,
  `conversation_id` varchar(100) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `astrologer_name` varchar(100) DEFAULT NULL,
  `consultation_type` enum('chat','call','video','audio','live') DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','cancelled','refunded') DEFAULT 'pending',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `astrologer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `conversation_id`, `user_id`, `astrologer_name`, `consultation_type`, `price`, `image`, `status`, `start_time`, `end_time`, `created_at`, `astrologer_id`) VALUES
(1025, 'CHAT1782886586894', '25_60_1782886586884', 25, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-01 06:16:26', '2026-07-01 06:17:30', '2026-07-01 06:16:26', 60),
(1026, 'CHAT1782886694502', '25_60_1782886694499', 25, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-01 06:18:14', '2026-07-01 06:18:45', '2026-07-01 06:18:14', 60),
(1027, 'CHAT1782886730832', '25_60_1782886730830', 25, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-01 06:18:50', '2026-07-01 06:19:13', '2026-07-01 06:18:50', 60),
(1028, 'CHAT1782886962942', '25_60_1782886962939', 25, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-01 06:22:42', '2026-07-01 06:22:46', '2026-07-01 06:22:42', 60),
(1029, 'CHAT1782887112018', '25_60_1782887112012', 25, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-01 06:25:12', '2026-07-01 06:25:14', '2026-07-01 06:25:12', 60),
(1030, 'CALL1782887150332', '812', 25, 'Aman', 'audio', 100.00, NULL, 'completed', '2026-07-01 06:25:50', '2026-07-01 06:27:38', '2026-07-01 06:25:50', 60),
(1031, 'CALL1782887277592', '813', 25, 'Aman', 'audio', 100.00, NULL, 'completed', '2026-07-01 06:27:57', '2026-07-01 06:29:27', '2026-07-01 06:27:57', 60),
(1032, 'CHAT1783398937534', '26_61_1783398937528', 26, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-07 10:05:37', '2026-07-07 10:06:29', '2026-07-07 04:35:37', 61),
(1033, 'CHAT1783399005080', '26_61_1783399005076', 26, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-07 10:06:45', '2026-07-07 10:06:49', '2026-07-07 04:36:45', 61),
(1034, 'CHAT1783399018382', '26_61_1783399018377', 26, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-07 10:06:58', '2026-07-07 10:07:06', '2026-07-07 04:36:58', 61),
(1035, 'CHAT1783399055156', '26_61_1783399055152', 26, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-07 10:07:35', '2026-07-07 10:07:47', '2026-07-07 04:37:35', 61),
(1036, 'CHAT1783401838185', '26_60_1783401838181', 26, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-07 10:53:58', '2026-07-07 10:54:07', '2026-07-07 05:23:58', 60),
(1037, 'CHAT1783420480516', '26_60_1783420480510', 26, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-07 16:04:40', '2026-07-07 16:05:52', '2026-07-07 10:34:40', 60),
(1038, 'CHAT1783481754422', '26_60_1783481754417', 26, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-08 09:05:54', '2026-07-08 09:06:38', '2026-07-08 03:35:54', 60),
(1039, 'CHAT1784348872600', '28_60_1784348872596', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 09:57:52', '2026-07-18 09:58:33', '2026-07-18 04:27:52', 60),
(1040, 'CHAT1784348971102', '28_60_1784348971095', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 09:59:31', '2026-07-18 10:00:43', '2026-07-18 04:29:31', 60),
(1041, 'CHAT1784349149865', '28_60_1784349149859', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 10:02:29', '2026-07-18 10:02:39', '2026-07-18 04:32:29', 60),
(1042, 'CHAT1784349390854', '28_60_1784349390849', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 10:06:30', '2026-07-18 10:06:35', '2026-07-18 04:36:30', 60),
(1043, 'CALL1784349578915', '814', 28, 'Aman', 'audio', 0.00, NULL, 'cancelled', '2026-07-18 10:09:38', '2026-07-18 10:09:45', '2026-07-18 04:39:38', 60),
(1044, 'CALL1784349589341', '815', 28, 'Test Astrologer', 'audio', 50.00, NULL, 'completed', '2026-07-18 10:09:49', '2026-07-18 10:10:07', '2026-07-18 04:39:49', 61),
(1045, 'CALL1784349621629', '816', 28, 'Test Astrologer', 'audio', 50.00, NULL, 'completed', '2026-07-18 10:10:21', '2026-07-18 10:10:30', '2026-07-18 04:40:21', 61),
(1046, 'CALL1784349680710', '817', 28, 'Test Astrologer', 'audio', 50.00, NULL, 'completed', '2026-07-18 10:11:20', '2026-07-18 10:11:26', '2026-07-18 04:41:20', 61),
(1047, 'CALL1784349698659', '818', 28, 'Test Astrologer', 'video', 0.00, NULL, 'cancelled', '2026-07-18 10:11:38', '2026-07-18 10:11:58', '2026-07-18 04:41:38', 61),
(1048, 'CALL1784349723760', '819', 28, 'Test Astrologer', 'audio', 0.00, NULL, 'cancelled', '2026-07-18 10:12:03', '2026-07-18 10:12:08', '2026-07-18 04:42:03', 61),
(1049, 'CALL1784349731949', '820', 28, 'Test Astrologer', 'video', 0.00, NULL, 'cancelled', '2026-07-18 10:12:11', '2026-07-18 10:12:35', '2026-07-18 04:42:11', 61),
(1050, 'CALL1784349818068', '821', 28, 'Test Astrologer', 'video', 80.00, NULL, 'completed', '2026-07-18 10:13:38', '2026-07-18 10:13:59', '2026-07-18 04:43:38', 61),
(1051, 'CHAT1784350616857', '28_60_1784350616851', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 10:26:56', '2026-07-18 10:27:03', '2026-07-18 04:56:56', 60),
(1052, 'CHAT1784350709263', '28_60_1784350709258', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 10:28:29', '2026-07-18 10:28:35', '2026-07-18 04:58:29', 60),
(1053, 'CHAT1784350970411', '28_60_1784350970406', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 10:32:50', '2026-07-18 10:32:55', '2026-07-18 05:02:50', 60),
(1054, 'CHAT1784353925359', '28_60_1784353925354', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 11:22:05', '2026-07-18 11:22:10', '2026-07-18 05:52:05', 60),
(1055, 'CHAT1784355623958', '28_60_1784355623954', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 11:50:23', '2026-07-18 11:51:39', '2026-07-18 06:20:23', 60),
(1056, 'CHAT1784355703038', '28_61_1784355703034', 28, 'Test Astrologer', 'chat', 30.00, NULL, 'completed', '2026-07-18 11:51:43', '2026-07-18 11:52:03', '2026-07-18 06:21:43', 61),
(1057, 'CHAT1784355807018', '28_61_1784355807014', 28, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-18 11:53:27', '2026-07-18 11:53:41', '2026-07-18 06:23:27', 61),
(1058, 'CHAT1784358100820', '28_61_1784358100814', 28, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-18 12:31:40', '2026-07-18 12:31:46', '2026-07-18 07:01:40', 61),
(1059, 'CHAT1784358214378', '28_61_1784358214374', 28, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-18 12:33:34', '2026-07-18 12:33:44', '2026-07-18 07:03:34', 61),
(1060, 'CHAT1784358903976', '28_61_1784358903970', 28, 'Test Astrologer', 'chat', 30.00, NULL, 'completed', '2026-07-18 12:45:03', '2026-07-18 12:45:20', '2026-07-18 07:15:03', 61),
(1061, 'CHAT1784360888257', '28_61_1784360888252', 28, 'Test Astrologer', 'chat', 30.00, NULL, 'completed', '2026-07-18 13:18:08', '2026-07-18 13:18:56', '2026-07-18 07:48:08', 61),
(1062, 'CHAT1784362115978', '28_61_1784362115973', 28, 'Test Astrologer', 'chat', 0.00, NULL, 'pending', '2026-07-18 13:38:35', NULL, '2026-07-18 08:08:35', 61),
(1063, 'CHAT1784363582445', '28_61_1784363582439', 28, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-18 14:03:02', '2026-07-18 14:03:17', '2026-07-18 08:33:02', 61),
(1064, 'CHAT1784363606440', '28_61_1784363606438', 28, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-18 14:03:26', '2026-07-18 14:03:41', '2026-07-18 08:33:26', 61),
(1065, 'CHAT1784365677548', '28_60_1784365677542', 28, 'Aman', 'chat', 0.00, NULL, 'completed', '2026-07-18 14:37:57', '2026-07-18 14:38:01', '2026-07-18 09:07:57', 60),
(1066, 'CHAT1784655774387', '26_61_1784655774382', 26, 'Test Astrologer', 'chat', 0.00, NULL, 'completed', '2026-07-21 23:12:54', '2026-07-21 23:13:02', '2026-07-21 17:42:54', 61),
(1067, 'CALL1784655786995', '822', 26, 'Test Astrologer', 'audio', 50.00, NULL, 'completed', '2026-07-21 23:13:06', '2026-07-21 23:13:44', '2026-07-21 17:43:06', 61),
(1068, 'CALL1784655831242', '823', 26, 'Test Astrologer', 'video', 80.00, NULL, 'completed', '2026-07-21 23:13:51', '2026-07-21 23:13:58', '2026-07-21 17:43:51', 61),
(1069, 'CHAT1784656797717', '26_65_1784656797713', 26, 'Kamlesh', 'chat', 0.00, NULL, 'completed', '2026-07-21 23:29:57', '2026-07-21 23:30:03', '2026-07-21 17:59:57', 65),
(1070, 'CALL1784656806070', '824', 26, 'Kamlesh', 'audio', 50.00, NULL, 'completed', '2026-07-21 23:30:06', '2026-07-21 23:30:12', '2026-07-21 18:00:06', 65),
(1071, 'CALL1784656823281', '825', 26, 'Kamlesh', 'video', 80.00, NULL, 'completed', '2026-07-21 23:30:23', '2026-07-21 23:30:29', '2026-07-21 18:00:23', 65),
(1072, 'CALL1784712731325', '826', 31, 'Ashu', 'audio', 50.00, NULL, 'completed', '2026-07-22 15:02:11', '2026-07-22 15:02:34', '2026-07-22 09:32:11', 66);

-- --------------------------------------------------------

--
-- Table structure for table `panchang`
--

CREATE TABLE `panchang` (
  `id` bigint(20) NOT NULL,
  `date` date NOT NULL,
  `day` varchar(20) DEFAULT NULL,
  `tithi_name` varchar(100) DEFAULT NULL,
  `tithi_description` text DEFAULT NULL,
  `tithi_status` varchar(50) DEFAULT NULL,
  `nakshatra_name` varchar(100) DEFAULT NULL,
  `nakshatra_description` text DEFAULT NULL,
  `nakshatra_status` varchar(50) DEFAULT NULL,
  `yoga_name` varchar(100) DEFAULT NULL,
  `yoga_description` text DEFAULT NULL,
  `yoga_status` varchar(50) DEFAULT NULL,
  `karan_name` varchar(100) DEFAULT NULL,
  `karan_description` text DEFAULT NULL,
  `karan_status` varchar(50) DEFAULT NULL,
  `rahu_kaal_time` varchar(50) DEFAULT NULL,
  `rahu_kaal_status` varchar(50) DEFAULT NULL,
  `abhijit_muhurat_time` varchar(50) DEFAULT NULL,
  `abhijit_muhurat_status` varchar(50) DEFAULT NULL,
  `amrit_kaal_time` varchar(50) DEFAULT NULL,
  `amrit_kaal_status` varchar(50) DEFAULT NULL,
  `auspicious` varchar(50) DEFAULT NULL,
  `overall_day_status` varchar(50) DEFAULT NULL,
  `overall_description` text DEFAULT NULL,
  `sunrise` varchar(20) DEFAULT NULL,
  `sunset` varchar(20) DEFAULT NULL,
  `moonrise` varchar(20) DEFAULT NULL,
  `moonset` varchar(20) DEFAULT NULL,
  `paksha` varchar(100) DEFAULT NULL,
  `hindu_month` varchar(100) DEFAULT NULL,
  `month` varchar(50) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `festivals` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`festivals`)),
  `vrat` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`vrat`)),
  `shubh_works` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`shubh_works`)),
  `avoid_works` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`avoid_works`)),
  `third_party_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `month_overall_energy` varchar(50) DEFAULT NULL,
  `total_days_in_month` int(11) DEFAULT NULL,
  `total_festivals` int(11) DEFAULT NULL,
  `important_festivals` longtext DEFAULT NULL,
  `best_days` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `panchang`
--

INSERT INTO `panchang` (`id`, `date`, `day`, `tithi_name`, `tithi_description`, `tithi_status`, `nakshatra_name`, `nakshatra_description`, `nakshatra_status`, `yoga_name`, `yoga_description`, `yoga_status`, `karan_name`, `karan_description`, `karan_status`, `rahu_kaal_time`, `rahu_kaal_status`, `abhijit_muhurat_time`, `abhijit_muhurat_status`, `amrit_kaal_time`, `amrit_kaal_status`, `auspicious`, `overall_day_status`, `overall_description`, `sunrise`, `sunset`, `moonrise`, `moonset`, `paksha`, `hindu_month`, `month`, `year`, `festivals`, `vrat`, `shubh_works`, `avoid_works`, `third_party_id`, `created_at`, `updated_at`, `month_overall_energy`, `total_days_in_month`, `total_festivals`, `important_festivals`, `best_days`) VALUES
(31, '2026-06-15', 'Monday', 'Amavasya', 'New moon day', 'average', 'Jyeshtha', 'Power and transformation', 'average', 'Vyatipata', 'Unfavorable changes', 'avoid', 'Kaulava', 'Good for learning', 'good', '09:00 AM - 10:30 AM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'average', 'average', 'अमावस्या और शुभ त्योहार के साथ मिश्रित', '05:44 AM', '07:29 PM', '08:15 AM', '07:00 PM', 'Krishna Paksha', 'Jyeshtha', 'June', 2026, '[{\"name\":\"Vat Purnima\",\"description\":\"वृक्ष पूजा और पति की लंबी उम्र के लिए\",\"_id\":\"6a16b9aa2aa3d655a2f02f67\"}]', '[]', '[\"वृक्ष पूजा\",\"दान\"]', '[\"विवाह\",\"शस्त्र उपयोग\"]', '6a16b9aa615b83be35cace64', '2026-06-16 08:13:12', '2026-06-16 08:13:12', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(32, '2026-06-16', 'Tuesday', 'Pratipada', 'First day of bright fortnight', 'good', 'Mula', 'Roots and foundation', 'average', 'Ganda', 'Mixed results', 'average', 'Taitila', 'Good for construction', 'good', '07:30 AM - 09:00 AM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'average', 'average', 'मूला नक्षत्र के साथ दिन औसत', '05:45 AM', '07:30 PM', '09:00 AM', '07:45 PM', 'Shukla Paksha', 'Ashadha', 'June', 2026, '[]', '[]', '[\"निर्माण\",\"शिक्षा\"]', '[\"महत्वपूर्ण निर्णय\"]', '6a16b9aa615b83be35cace68', '2026-06-16 08:15:46', '2026-06-16 08:15:46', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(33, '2026-06-17', 'Wednesday', 'Dwitiya', 'Second day of bright fortnight', 'average', 'Purva Ashadha', 'Invincibility and victory', 'good', 'Vyatipata', 'Unfavorable changes', 'avoid', 'Gara', 'Good for healing', 'good', '06:00 AM - 07:30 AM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'avoid', 'avoid', 'व्यातिपात योग से दिन रोधित', '05:46 AM', '07:31 PM', '09:45 AM', '08:30 PM', 'Shukla Paksha', 'Ashadha', 'June', 2026, '[]', '[]', '[\"चिकित्सा\",\"उपचार\"]', '[\"विवाह\",\"यात्रा\"]', '6a16b9aa615b83be35cace67', '2026-06-16 09:39:18', '2026-06-16 09:39:18', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(34, '2026-06-01', 'Monday', 'Pratipada', 'First day of bright fortnight', 'good', 'Rohini', 'Favorable for growth', 'excellent', 'Vishkambha', 'Mixed results', 'average', 'Bava', 'Good for beginnings', 'good', '09:00 AM - 10:30 AM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'good', 'good', 'शुभ नक्षत्र के साथ अच्छा दिन', '05:30 AM', '07:15 PM', '09:45 PM', '08:30 AM', 'Shukla Paksha', 'Jyeshtha', 'June', 2026, '[]', '[]', '[\"विवाह\",\"नई शुरुआत\"]', '[\"बड़े काम\"]', '6a16b9aa615b83be35cace48', '2026-06-16 11:26:56', '2026-06-16 11:26:56', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(35, '2026-06-11', 'Thursday', 'Ekadashi', 'Eleventh day of dark fortnight', 'excellent', 'Chitra', 'Creativity and beauty', 'good', 'Vridhi', 'Growth and expansion', 'good', 'Gara', 'Good for healing', 'good', '09:00 AM - 10:30 AM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'excellent', 'excellent', 'एकादशी और शुभ योग के साथ बेहतरीन दिन', '05:40 AM', '07:25 PM', '05:15 AM', '04:00 PM', 'Krishna Paksha', 'Jyeshtha', 'June', 2026, '[{\"name\":\"Nirjala Ekadashi\",\"description\":\"व्रत दिवस जल रहित रखा जाता है\",\"_id\":\"6a16b9aa2aa3d655a2f02f61\"}]', '[{\"name\":\"Nirjala Ekadashi\",\"description\":\"जल रहित व्रत शुद्धि के लिए\",\"_id\":\"6a16b9aa2aa3d655a2f02f62\"}]', '[\"व्रत\",\"ध्यान\"]', '[\"खानपान\"]', '6a16b9aa615b83be35cace5c', '2026-06-16 11:27:06', '2026-06-16 11:27:06', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(36, '2026-06-12', 'Friday', 'Dwadashi', 'Twelfth day of dark fortnight', 'good', 'Swati', 'Freedom and movement', 'good', 'Dhruva', 'Stability', 'good', 'Vanija', 'Good for trade', 'good', '03:00 PM - 04:30 PM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'good', 'good', 'स्थिरता योग और अच्छा नक्षत्र', '05:41 AM', '07:26 PM', '06:00 AM', '04:45 PM', 'Krishna Paksha', 'Jyeshtha', 'June', 2026, '[]', '[]', '[\"व्यापार\",\"यात्रा\"]', '[\"विवाह\",\"शस्त्र उपयोग\"]', '6a16b9aa615b83be35cace5e', '2026-06-16 11:27:07', '2026-06-16 11:27:07', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(37, '2026-06-24', 'Wednesday', 'Navami', 'Ninth day of bright fortnight', 'average', 'Revati', 'Wealth and fulfillment', 'excellent', 'Dhruva', 'Stability', 'good', 'Vanija', 'Good for trade', 'good', '06:00 AM - 07:30 AM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'good', 'good', 'रेवती नक्षत्र और स्थिरता योग', '05:53 AM', '07:38 PM', '03:00 AM', '01:45 AM', 'Shukla Paksha', 'Ashadha', 'June', 2026, '[]', '[]', '[\"व्यापार\",\"समृद्धि\"]', '[\"नई शुरुआत\",\"विवाह\"]', '6a16b9aa615b83be35cace72', '2026-06-24 07:09:05', '2026-06-24 07:09:05', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(38, '2026-06-25', 'Thursday', 'Dashami', 'Tenth day of bright fortnight', 'good', 'Ashwini', 'Energy and speed', 'excellent', 'Vyatipata', 'Unfavorable changes', 'avoid', 'Bhadra', 'Good for spiritual work', 'good', '09:00 AM - 10:30 AM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'avoid', 'avoid', 'अश्विनी नक्षत्र और व्यातिपात योग', '05:54 AM', '07:39 PM', '03:45 AM', '02:30 AM', 'Shukla Paksha', 'Ashadha', 'June', 2026, '[]', '[{\"name\":\"Ashadha Krishna Ekadashi\",\"description\":\"व्रत दिवस\",\"_id\":\"6a16b9aa2aa3d655a2f02f73\"}]', '[\"व्रत\",\"ध्यान\"]', '[\"खानपान\"]', '6a16b9aa615b83be35cace74', '2026-06-25 07:50:39', '2026-06-25 07:50:39', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(39, '2026-05-01', 'Friday', 'Dashami', 'Tenth day of bright fortnight', 'good', 'Vishakha', 'Star of prosperity', 'good', 'Siddha', 'Auspicious for new beginnings', 'excellent', 'Bava', 'Favorable for construction', 'good', '10:30-12:00', 'avoid', '11:30-12:30', 'excellent', '06:00-07:30', 'good', 'good', 'good', 'शुभ दिन, विशेष रूप से शुरुआती कार्यों के लिए उत्तम', '05:45', '18:45', '19:30', '03:30', 'Shukla Paksha', 'Vaishakha', 'May', 2026, '[]', '[]', '[\"विवाह\",\"गृहप्रवेश\",\"नए उद्योग\"]', '[\"यात्रा\",\"किसी को नुकसान पहुंचाना\"]', '6a16b7f0615b83be35cacd56', '2026-06-25 07:59:37', '2026-06-25 07:59:37', 'average', 31, 2, '[\"बुद्ध पूर्णिमा\",\"गंगा दशहरा\"]', '[\"2026-05-02\",\"2026-05-16\",\"2026-05-31\"]'),
(40, '2026-06-27', 'Saturday', 'Dwadashi', 'Twelfth day of bright fortnight', 'good', 'Krittika', 'Fire and purification', 'excellent', 'Preeti', 'Harmony and love', 'good', 'Kaulava', 'Good for learning', 'good', '12:00 PM - 01:30 PM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'good', 'good', 'कृत्तिका नक्षत्र और प्रीति योग', '05:56 AM', '07:41 PM', '05:15 AM', '04:00 AM', 'Shukla Paksha', 'Ashadha', 'June', 2026, '[]', '[]', '[\"शिक्षा\",\"पवित्र काम\"]', '[\"विवाह\",\"शस्त्र उपयोग\"]', '6a16b9aa615b83be35cace78', '2026-06-27 07:36:46', '2026-06-27 07:36:46', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(41, '2026-06-28', 'Sunday', 'Trayodashi', 'Thirteenth day of bright fortnight', 'average', 'Rohini', 'Favorable for growth', 'excellent', 'Ayushman', 'Longevity and health', 'good', 'Taitila', 'Good for construction', 'good', '10:30 AM - 12:00 PM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'good', 'good', 'रोहिणी नक्षत्र और आयुष्मान योग', '05:57 AM', '07:42 PM', '06:00 AM', '04:45 AM', 'Shukla Paksha', 'Ashadha', 'June', 2026, '[]', '[]', '[\"निर्माण\",\"स्वास्थ्य\"]', '[\"नई शुरुआत\",\"विवाह\"]', '6a16b9aa615b83be35cace7a', '2026-06-28 14:28:48', '2026-06-28 14:28:48', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(42, '2026-06-30', 'Tuesday', 'Purnima', 'Full moon day', 'excellent', 'Ardra', 'Transformation energy', 'average', 'Shobhana', 'Brightness and fame', 'good', 'Vanija', 'Good for trade', 'good', '07:30 AM - 09:00 AM', 'avoid', '11:30 AM - 12:30 PM', 'excellent', '06:00 AM - 07:30 AM', 'good', 'excellent', 'excellent', 'पूर्णिमा और गुरु पूजा के साथ बेहतरीन दिन', '05:59 AM', '07:44 PM', '07:30 AM', '06:15 AM', 'Shukla Paksha', 'Ashadha', 'June', 2026, '[{\"name\":\"Guru Purnima\",\"description\":\"गुरु पूजा दिवस\",\"_id\":\"6a16b9aa2aa3d655a2f02f79\"}]', '[]', '[\"पूजा\",\"दान\"]', '[\"विवाह\",\"शस्त्र उपयोग\"]', '6a16b9aa615b83be35cace7e', '2026-06-30 12:18:49', '2026-06-30 12:18:49', 'average', 30, 4, '[\"Nirjala Ekadashi\",\"Vat Purnima\",\"Ratha Yatra\",\"Guru Purnima\"]', '[\"2026-06-04\",\"2026-06-11\",\"2026-06-29\",\"2026-06-30\"]'),
(43, '2026-07-01', 'Wednesday', 'प्रतिपदा', 'चंद्रमा का पहला दिन', 'good', 'उत्तरा फाल्गुनी', 'शुभ नक्षत्र', 'excellent', 'व्यातिपाता', 'चुनौतीपूर्ण योग', 'avoid', 'बावा', 'शुभ कारण', 'good', '10:30 AM - 12:00 PM', 'avoid', '11:45 AM - 12:30 PM', 'excellent', '06:15 AM - 07:30 AM', 'good', 'average', 'average', 'आज व्यातिपाता योग के कारण धैर्य रखें', '05:45 AM', '07:15 PM', '10:30 AM', '10:45 PM', 'कृष्ण पक्ष', 'आषाढ', 'July', 2026, '[]', '[]', '[\"नए काम शुरू करना\",\"दान करना\"]', '[\"महत्वपूर्ण निर्णय लेना\"]', '6a16bf5a615b83be35cad0e3', '2026-07-01 06:01:58', '2026-07-01 06:01:58', 'good', 31, 4, '[\"गुरु पूर्णिमा\",\"श्रावण मास शुरू\",\"रक्षा बंधन\",\"श्री कृष्ण जन्माष्टमी\"]', '[\"2026-07-06\",\"2026-07-07\",\"2026-07-13\",\"2026-07-17\",\"2026-07-21\"]'),
(44, '2026-07-09', 'Thursday', 'तृतीया', 'चंद्रमा का तीसरा दिन', 'average', 'पूर्वाषाढा', 'जल और संपत्ति का नक्षत्र', 'good', 'व्याघात', 'अस्थिर योग', 'avoid', 'बालव', 'शुभ कारण', 'good', '09:00 AM - 10:30 AM', 'avoid', '11:45 AM - 12:30 PM', 'excellent', '06:15 AM - 07:30 AM', 'good', 'average', 'average', 'व्याघात योग के कारण सावधान रहें', '05:53 AM', '07:07 PM', '10:38 AM', '10:53 PM', 'शुक्ल पक्ष', 'श्रावण', 'July', 2026, '[]', '[]', '[\"जल काम करना\",\"संपत्ति काम करना\"]', '[\"विवाद करना\"]', '6a16bf5a615b83be35cad0f4', '2026-07-09 08:13:40', '2026-07-09 08:13:40', 'good', 31, 4, '[\"गुरु पूर्णिमा\",\"श्रावण मास शुरू\",\"रक्षा बंधन\",\"श्री कृष्ण जन्माष्टमी\"]', '[\"2026-07-06\",\"2026-07-07\",\"2026-07-13\",\"2026-07-17\",\"2026-07-21\"]'),
(45, '2026-07-20', 'Monday', 'चतुर्दशी', 'चंद्रमा का चौदहवां दिन', 'avoid', 'रोहिणी', 'वृद्धि और समृद्धि का नक्षत्र', 'excellent', 'ध्रुव', 'स्थिरता का योग', 'good', 'वणिज', 'शुभ कारण', 'good', '07:30 AM - 09:00 AM', 'avoid', '11:45 AM - 12:30 PM', 'excellent', '06:15 AM - 07:30 AM', 'good', 'avoid', 'avoid', 'चतुर्दशी तिथि पर कोई काम न करें', '06:04 AM', '06:56 PM', '10:49 AM', '11:04 PM', 'शुक्ल पक्ष', 'श्रावण', 'July', 2026, '[]', '[{\"name\":\"श्रावण सोमवार व्रत\",\"description\":\"शिव जी की पूजा और व्रत\",\"_id\":\"6a16bf5a2aa3d655a2f02f9b\"}]', '[\"पूजा करना\",\"ध्यान करना\"]', '[\"कोई भी काम नहीं करना\"]', '6a16bf5a615b83be35cad11d', '2026-07-20 14:52:31', '2026-07-20 14:52:31', 'good', 31, 4, '[\"गुरु पूर्णिमा\",\"श्रावण मास शुरू\",\"रक्षा बंधन\",\"श्री कृष्ण जन्माष्टमी\"]', '[\"2026-07-06\",\"2026-07-07\",\"2026-07-13\",\"2026-07-17\",\"2026-07-21\"]'),
(46, '2026-07-21', 'Tuesday', 'पूर्णिमा', 'चंद्रमा का पूर्ण दिन', 'excellent', 'मृगशीर्ष', 'शिकार और विजय का नक्षत्र', 'good', 'व्याघात', 'अस्थिर योग', 'avoid', 'विस्ति', 'अशुभ कारण', 'avoid', '03:00 PM - 04:30 PM', 'avoid', '11:45 AM - 12:30 PM', 'excellent', '06:15 AM - 07:30 AM', 'good', 'excellent', 'excellent', 'रक्षा बंधन शुभ है', '06:05 AM', '06:55 PM', '10:50 AM', '11:05 PM', 'शुक्ल पक्ष', 'श्रावण', 'July', 2026, '[{\"name\":\"रक्षा बंधन\",\"description\":\"भाई बहन का पवित्र बंधन\",\"_id\":\"6a16bf5a2aa3d655a2f02f9d\"}]', '[]', '[\"रक्षा बंधन मनाना\",\"दान करना\"]', '[\"विवाद करना\"]', '6a16bf5a615b83be35cad11f', '2026-07-21 04:12:18', '2026-07-21 04:12:18', 'good', 31, 4, '[\"गुरु पूर्णिमा\",\"श्रावण मास शुरू\",\"रक्षा बंधन\",\"श्री कृष्ण जन्माष्टमी\"]', '[\"2026-07-06\",\"2026-07-07\",\"2026-07-13\",\"2026-07-17\",\"2026-07-21\"]'),
(47, '2026-07-22', 'Wednesday', 'प्रतिपदा', 'चंद्रमा का पहला दिन', 'good', 'आर्द्रा', 'बारिश और तरलता का नक्षत्र', 'good', 'व्यतीपात', 'चुनौतीपूर्ण योग', 'avoid', 'भद्र', 'शुभ कारण', 'good', '10:30 AM - 12:00 PM', 'avoid', '11:45 AM - 12:30 PM', 'excellent', '06:15 AM - 07:30 AM', 'good', 'average', 'average', 'व्यतीपात योग के कारण सावधान रहें', '06:06 AM', '06:54 PM', '10:51 AM', '11:06 PM', 'कृष्ण पक्ष', 'श्रावण', 'July', 2026, '[]', '[]', '[\"नए काम शुरू करना\",\"बारिश काम करना\"]', '[\"विवाद करना\"]', '6a16bf5a615b83be35cad107', '2026-07-21 14:33:04', '2026-07-21 14:33:04', 'good', 31, 4, '[\"गुरु पूर्णिमा\",\"श्रावण मास शुरू\",\"रक्षा बंधन\",\"श्री कृष्ण जन्माष्टमी\"]', '[\"2026-07-06\",\"2026-07-07\",\"2026-07-13\",\"2026-07-17\",\"2026-07-21\"]'),
(48, '2026-07-26', 'Sunday', 'पंचमी', 'चंद्रमा का पांचवां दिन', 'good', 'मूल', 'जड़ और आधार का नक्षत्र', 'avoid', 'गंड', 'अस्थिर योग', 'avoid', 'गर', 'अशुभ कारण', 'avoid', '04:30 PM - 06:00 PM', 'avoid', '11:45 AM - 12:30 PM', 'excellent', '06:15 AM - 07:30 AM', 'good', 'avoid', 'avoid', 'मूल नक्षत्र और गंड योग अशुभ है', '06:10 AM', '06:50 PM', '10:55 AM', '11:10 PM', 'कृष्ण पक्ष', 'श्रावण', 'July', 2026, '[]', '[]', '[\"जड़ काम करना\",\"आधार काम करना\"]', '[\"जोखिम लेना\"]', '6a16bf5a615b83be35cad10f', '2026-07-21 14:33:09', '2026-07-21 14:33:09', 'good', 31, 4, '[\"गुरु पूर्णिमा\",\"श्रावण मास शुरू\",\"रक्षा बंधन\",\"श्री कृष्ण जन्माष्टमी\"]', '[\"2026-07-06\",\"2026-07-07\",\"2026-07-13\",\"2026-07-17\",\"2026-07-21\"]'),
(49, '2026-07-23', 'Thursday', 'द्वितीया', 'चंद्रमा का दूसरा दिन', 'average', 'पुनर्वसु', 'पुनर्जन्म और नवीनता का नक्षत्र', 'good', 'शूल', 'कठिन योग', 'avoid', 'बालव', 'शुभ कारण', 'good', '09:00 AM - 10:30 AM', 'avoid', '11:45 AM - 12:30 PM', 'excellent', '06:15 AM - 07:30 AM', 'good', 'average', 'average', 'शूल योग के कारण सावधान रहें', '06:07 AM', '06:53 PM', '10:52 AM', '11:07 PM', 'कृष्ण पक्ष', 'श्रावण', 'July', 2026, '[]', '[]', '[\"पुनर्जन्म काम करना\",\"नवीनता काम करना\"]', '[\"विवाद करना\"]', '6a16bf5a615b83be35cad109', '2026-07-22 12:08:58', '2026-07-22 12:08:58', 'good', 31, 4, '[\"गुरु पूर्णिमा\",\"श्रावण मास शुरू\",\"रक्षा बंधन\",\"श्री कृष्ण जन्माष्टमी\"]', '[\"2026-07-06\",\"2026-07-07\",\"2026-07-13\",\"2026-07-17\",\"2026-07-21\"]'),
(50, '2026-07-24', 'Friday', 'तृतीया', 'चंद्रमा का तीसरा दिन', 'average', 'पुष्य', 'स्वास्थ्य और शुभ कार्य का नक्षत्र', 'good', 'व्याघात', 'अस्थिर योग', 'avoid', 'कौलव', 'शुभ कारण', 'good', '01:30 PM - 03:00 PM', 'avoid', '11:45 AM - 12:30 PM', 'excellent', '06:15 AM - 07:30 AM', 'good', 'average', 'average', 'व्याघात योग के कारण सावधान रहें', '06:08 AM', '06:52 PM', '10:53 AM', '11:08 PM', 'कृष्ण पक्ष', 'श्रावण', 'July', 2026, '[]', '[]', '[\"स्वास्थ्य काम करना\",\"शुभ कार्य करना\"]', '[\"जोखिम लेना\"]', '6a16bf5a615b83be35cad10b', '2026-07-22 12:08:59', '2026-07-22 12:08:59', 'good', 31, 4, '[\"गुरु पूर्णिमा\",\"श्रावण मास शुरू\",\"रक्षा बंधन\",\"श्री कृष्ण जन्माष्टमी\"]', '[\"2026-07-06\",\"2026-07-07\",\"2026-07-13\",\"2026-07-17\",\"2026-07-21\"]');

-- --------------------------------------------------------

--
-- Table structure for table `panchang_month_dates`
--

CREATE TABLE `panchang_month_dates` (
  `id` bigint(20) NOT NULL,
  `panchang_date` date NOT NULL,
  `date` date NOT NULL,
  `day` varchar(20) DEFAULT NULL,
  `tithi` varchar(100) DEFAULT NULL,
  `nakshatra` varchar(100) DEFAULT NULL,
  `festival` varchar(255) DEFAULT NULL,
  `vrat` varchar(255) DEFAULT NULL,
  `auspicious` varchar(50) DEFAULT NULL,
  `is_selected_date` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `panchang_month_dates`
--

INSERT INTO `panchang_month_dates` (`id`, `panchang_date`, `date`, `day`, `tithi`, `nakshatra`, `festival`, `vrat`, `auspicious`, `is_selected_date`, `created_at`) VALUES
(1, '2026-06-15', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(2, '2026-06-15', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(3, '2026-06-15', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-16 08:13:12'),
(4, '2026-06-15', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-16 08:13:12'),
(5, '2026-06-15', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(6, '2026-06-15', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-16 08:13:12'),
(7, '2026-06-15', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(8, '2026-06-15', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(9, '2026-06-15', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-16 08:13:12'),
(10, '2026-06-15', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(11, '2026-06-15', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-16 08:13:12'),
(12, '2026-06-15', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(13, '2026-06-15', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-16 08:13:12'),
(14, '2026-06-15', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-16 08:13:12'),
(15, '2026-06-15', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 1, '2026-06-16 08:13:12'),
(16, '2026-06-15', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-16 08:13:12'),
(17, '2026-06-15', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 08:13:12'),
(18, '2026-06-15', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 08:13:12'),
(19, '2026-06-15', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(20, '2026-06-15', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(21, '2026-06-15', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-16 08:13:12'),
(22, '2026-06-15', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-16 08:13:12'),
(23, '2026-06-15', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(24, '2026-06-15', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(25, '2026-06-15', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-16 08:13:12'),
(26, '2026-06-15', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-16 08:13:12'),
(27, '2026-06-15', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(28, '2026-06-15', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 08:13:12'),
(29, '2026-06-15', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-16 08:13:12'),
(30, '2026-06-15', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-16 08:13:12'),
(31, '2026-06-16', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(32, '2026-06-16', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(33, '2026-06-16', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-16 08:15:46'),
(34, '2026-06-16', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-16 08:15:46'),
(35, '2026-06-16', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(36, '2026-06-16', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-16 08:15:46'),
(37, '2026-06-16', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(38, '2026-06-16', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(39, '2026-06-16', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-16 08:15:46'),
(40, '2026-06-16', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(41, '2026-06-16', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-16 08:15:46'),
(42, '2026-06-16', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(43, '2026-06-16', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-16 08:15:46'),
(44, '2026-06-16', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-16 08:15:46'),
(45, '2026-06-16', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-16 08:15:46'),
(46, '2026-06-16', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 1, '2026-06-16 08:15:46'),
(47, '2026-06-16', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 08:15:46'),
(48, '2026-06-16', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 08:15:46'),
(49, '2026-06-16', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(50, '2026-06-16', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(51, '2026-06-16', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-16 08:15:46'),
(52, '2026-06-16', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-16 08:15:46'),
(53, '2026-06-16', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(54, '2026-06-16', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(55, '2026-06-16', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-16 08:15:46'),
(56, '2026-06-16', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-16 08:15:46'),
(57, '2026-06-16', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(58, '2026-06-16', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 08:15:46'),
(59, '2026-06-16', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-16 08:15:46'),
(60, '2026-06-16', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-16 08:15:46'),
(61, '2026-06-17', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(62, '2026-06-17', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(63, '2026-06-17', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-16 09:39:18'),
(64, '2026-06-17', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-16 09:39:18'),
(65, '2026-06-17', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(66, '2026-06-17', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-16 09:39:18'),
(67, '2026-06-17', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(68, '2026-06-17', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(69, '2026-06-17', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-16 09:39:18'),
(70, '2026-06-17', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(71, '2026-06-17', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-16 09:39:18'),
(72, '2026-06-17', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(73, '2026-06-17', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-16 09:39:18'),
(74, '2026-06-17', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-16 09:39:18'),
(75, '2026-06-17', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-16 09:39:18'),
(76, '2026-06-17', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-16 09:39:18'),
(77, '2026-06-17', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 1, '2026-06-16 09:39:18'),
(78, '2026-06-17', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 09:39:18'),
(79, '2026-06-17', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(80, '2026-06-17', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(81, '2026-06-17', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-16 09:39:18'),
(82, '2026-06-17', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-16 09:39:18'),
(83, '2026-06-17', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(84, '2026-06-17', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(85, '2026-06-17', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-16 09:39:18'),
(86, '2026-06-17', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-16 09:39:18'),
(87, '2026-06-17', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(88, '2026-06-17', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 09:39:18'),
(89, '2026-06-17', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-16 09:39:18'),
(90, '2026-06-17', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-16 09:39:18'),
(91, '2026-06-01', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 1, '2026-06-16 11:26:56'),
(92, '2026-06-01', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(93, '2026-06-01', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-16 11:26:56'),
(94, '2026-06-01', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-16 11:26:56'),
(95, '2026-06-01', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(96, '2026-06-01', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-16 11:26:56'),
(97, '2026-06-01', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(98, '2026-06-01', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(99, '2026-06-01', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-16 11:26:56'),
(100, '2026-06-01', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(101, '2026-06-01', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-16 11:26:56'),
(102, '2026-06-01', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(103, '2026-06-01', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-16 11:26:56'),
(104, '2026-06-01', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-16 11:26:56'),
(105, '2026-06-01', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-16 11:26:56'),
(106, '2026-06-01', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-16 11:26:56'),
(107, '2026-06-01', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 11:26:56'),
(108, '2026-06-01', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 11:26:56'),
(109, '2026-06-01', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(110, '2026-06-01', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(111, '2026-06-01', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-16 11:26:56'),
(112, '2026-06-01', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-16 11:26:56'),
(113, '2026-06-01', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(114, '2026-06-01', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(115, '2026-06-01', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-16 11:26:56'),
(116, '2026-06-01', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-16 11:26:56'),
(117, '2026-06-01', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(118, '2026-06-01', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 11:26:56'),
(119, '2026-06-01', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-16 11:26:56'),
(120, '2026-06-01', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-16 11:26:56'),
(121, '2026-06-11', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(122, '2026-06-11', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(123, '2026-06-11', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-16 11:27:06'),
(124, '2026-06-11', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-16 11:27:06'),
(125, '2026-06-11', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(126, '2026-06-11', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:06'),
(127, '2026-06-11', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(128, '2026-06-11', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(129, '2026-06-11', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:06'),
(130, '2026-06-11', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(131, '2026-06-11', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 1, '2026-06-16 11:27:06'),
(132, '2026-06-11', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(133, '2026-06-11', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:06'),
(134, '2026-06-11', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:06'),
(135, '2026-06-11', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-16 11:27:06'),
(136, '2026-06-11', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-16 11:27:06'),
(137, '2026-06-11', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:06'),
(138, '2026-06-11', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:06'),
(139, '2026-06-11', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(140, '2026-06-11', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(141, '2026-06-11', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-16 11:27:06'),
(142, '2026-06-11', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-16 11:27:06'),
(143, '2026-06-11', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(144, '2026-06-11', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(145, '2026-06-11', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-16 11:27:06'),
(146, '2026-06-11', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:06'),
(147, '2026-06-11', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(148, '2026-06-11', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 11:27:06'),
(149, '2026-06-11', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-16 11:27:06'),
(150, '2026-06-11', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-16 11:27:06'),
(151, '2026-06-12', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 11:27:07'),
(152, '2026-06-12', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(153, '2026-06-12', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-16 11:27:08'),
(154, '2026-06-12', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-16 11:27:08'),
(155, '2026-06-12', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(156, '2026-06-12', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:08'),
(157, '2026-06-12', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(158, '2026-06-12', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(159, '2026-06-12', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:08'),
(160, '2026-06-12', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(161, '2026-06-12', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-16 11:27:08'),
(162, '2026-06-12', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 1, '2026-06-16 11:27:08'),
(163, '2026-06-12', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:08'),
(164, '2026-06-12', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:08'),
(165, '2026-06-12', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-16 11:27:08'),
(166, '2026-06-12', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-16 11:27:08'),
(167, '2026-06-12', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:08'),
(168, '2026-06-12', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:08'),
(169, '2026-06-12', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(170, '2026-06-12', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(171, '2026-06-12', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-16 11:27:08'),
(172, '2026-06-12', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-16 11:27:08'),
(173, '2026-06-12', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(174, '2026-06-12', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(175, '2026-06-12', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-16 11:27:08'),
(176, '2026-06-12', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-16 11:27:08'),
(177, '2026-06-12', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(178, '2026-06-12', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-16 11:27:08'),
(179, '2026-06-12', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-16 11:27:08'),
(180, '2026-06-12', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-16 11:27:08'),
(181, '2026-06-24', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(182, '2026-06-24', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(183, '2026-06-24', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-24 07:09:05'),
(184, '2026-06-24', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-24 07:09:05'),
(185, '2026-06-24', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(186, '2026-06-24', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-24 07:09:05'),
(187, '2026-06-24', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(188, '2026-06-24', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(189, '2026-06-24', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-24 07:09:05'),
(190, '2026-06-24', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(191, '2026-06-24', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-24 07:09:05'),
(192, '2026-06-24', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(193, '2026-06-24', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-24 07:09:05'),
(194, '2026-06-24', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-24 07:09:05'),
(195, '2026-06-24', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-24 07:09:05'),
(196, '2026-06-24', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-24 07:09:05'),
(197, '2026-06-24', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-24 07:09:05'),
(198, '2026-06-24', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-24 07:09:05'),
(199, '2026-06-24', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(200, '2026-06-24', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(201, '2026-06-24', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-24 07:09:05'),
(202, '2026-06-24', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-24 07:09:05'),
(203, '2026-06-24', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(204, '2026-06-24', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 1, '2026-06-24 07:09:05'),
(205, '2026-06-24', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-24 07:09:05'),
(206, '2026-06-24', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-24 07:09:05'),
(207, '2026-06-24', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(208, '2026-06-24', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-24 07:09:05'),
(209, '2026-06-24', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-24 07:09:05'),
(210, '2026-06-24', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-24 07:09:05'),
(211, '2026-06-25', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(212, '2026-06-25', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(213, '2026-06-25', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-25 07:50:39'),
(214, '2026-06-25', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-25 07:50:39'),
(215, '2026-06-25', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(216, '2026-06-25', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-25 07:50:39'),
(217, '2026-06-25', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(218, '2026-06-25', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(219, '2026-06-25', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-25 07:50:39'),
(220, '2026-06-25', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(221, '2026-06-25', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-25 07:50:39'),
(222, '2026-06-25', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(223, '2026-06-25', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-25 07:50:39'),
(224, '2026-06-25', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-25 07:50:39'),
(225, '2026-06-25', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-25 07:50:39'),
(226, '2026-06-25', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-25 07:50:39'),
(227, '2026-06-25', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-25 07:50:39'),
(228, '2026-06-25', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-25 07:50:39'),
(229, '2026-06-25', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(230, '2026-06-25', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(231, '2026-06-25', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-25 07:50:39'),
(232, '2026-06-25', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-25 07:50:39'),
(233, '2026-06-25', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(234, '2026-06-25', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(235, '2026-06-25', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 1, '2026-06-25 07:50:39'),
(236, '2026-06-25', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-25 07:50:39'),
(237, '2026-06-25', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(238, '2026-06-25', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-25 07:50:39'),
(239, '2026-06-25', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-25 07:50:39'),
(240, '2026-06-25', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-25 07:50:39'),
(241, '2026-05-01', '2026-05-01', 'Friday', 'Dashami', 'Vishakha', NULL, NULL, 'good', 1, '2026-06-25 07:59:37'),
(242, '2026-05-01', '2026-05-02', 'Saturday', 'Ekadashi', 'Vishakha', NULL, 'वरुथिनी एकादशी', 'excellent', 0, '2026-06-25 07:59:37'),
(243, '2026-05-01', '2026-05-03', 'Sunday', 'Dwadashi', 'Anuradha', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(244, '2026-05-01', '2026-05-04', 'Monday', 'Trayodashi', 'Jyeshtha', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(245, '2026-05-01', '2026-05-05', 'Tuesday', 'Chaturdashi', 'Jyeshtha', 'बुद्ध पूर्णिमा', 'बुद्ध पूर्णिमा व्रत', 'good', 0, '2026-06-25 07:59:37'),
(246, '2026-05-01', '2026-05-06', 'Wednesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(247, '2026-05-01', '2026-05-07', 'Thursday', 'Dwitiya', 'Mula', NULL, NULL, 'avoid', 0, '2026-06-25 07:59:37'),
(248, '2026-05-01', '2026-05-08', 'Friday', 'Tritiya', 'Purvashadha', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(249, '2026-05-01', '2026-05-09', 'Saturday', 'Chaturthi', 'Purvashadha', NULL, 'संकष्टी चतुर्थी', 'average', 0, '2026-06-25 07:59:37'),
(250, '2026-05-01', '2026-05-10', 'Sunday', 'Panchami', 'Uttarashadha', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(251, '2026-05-01', '2026-05-11', 'Monday', 'Shashthi', 'Uttarashadha', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(252, '2026-05-01', '2026-05-12', 'Tuesday', 'Saptami', 'Uttarashadha', NULL, NULL, 'good', 0, '2026-06-25 07:59:37'),
(253, '2026-05-01', '2026-05-13', 'Wednesday', 'Ashtami', 'Shravana', NULL, NULL, 'good', 0, '2026-06-25 07:59:37'),
(254, '2026-05-01', '2026-05-14', 'Thursday', 'Navami', 'Shravana', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(255, '2026-05-01', '2026-05-15', 'Friday', 'Dashami', 'Dhanishta', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(256, '2026-05-01', '2026-05-16', 'Saturday', 'Ekadashi', 'Dhanishta', NULL, 'मोहिनी एकादशी', 'excellent', 0, '2026-06-25 07:59:37'),
(257, '2026-05-01', '2026-05-17', 'Sunday', 'Dwadashi', 'Shatabhisha', NULL, NULL, 'good', 0, '2026-06-25 07:59:37'),
(258, '2026-05-01', '2026-05-18', 'Monday', 'Trayodashi', 'Shatabhisha', NULL, NULL, 'avoid', 0, '2026-06-25 07:59:37'),
(259, '2026-05-01', '2026-05-19', 'Tuesday', 'Chaturdashi', 'Purvabhadrapada', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(260, '2026-05-01', '2026-05-20', 'Wednesday', 'Amavasya', 'Purvabhadrapada', NULL, 'अमावस्या व्रत', 'average', 0, '2026-06-25 07:59:37'),
(261, '2026-05-01', '2026-05-21', 'Thursday', 'Pratipada', 'Uttarabhadrapada', NULL, NULL, 'good', 0, '2026-06-25 07:59:37'),
(262, '2026-05-01', '2026-05-22', 'Friday', 'Dwitiya', 'Uttarabhadrapada', NULL, NULL, 'good', 0, '2026-06-25 07:59:37'),
(263, '2026-05-01', '2026-05-23', 'Saturday', 'Tritiya', 'Revati', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(264, '2026-05-01', '2026-05-24', 'Sunday', 'Chaturthi', 'Revati', NULL, 'गणेश चतुर्थी', 'average', 0, '2026-06-25 07:59:37'),
(265, '2026-05-01', '2026-05-25', 'Monday', 'Panchami', 'Revati', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(266, '2026-05-01', '2026-05-26', 'Tuesday', 'Shashthi', 'Ashwini', NULL, NULL, 'good', 0, '2026-06-25 07:59:37'),
(267, '2026-05-01', '2026-05-27', 'Wednesday', 'Saptami', 'Ashwini', NULL, NULL, 'good', 0, '2026-06-25 07:59:37'),
(268, '2026-05-01', '2026-05-28', 'Thursday', 'Ashtami', 'Bharani', NULL, NULL, 'average', 0, '2026-06-25 07:59:37'),
(269, '2026-05-01', '2026-05-29', 'Friday', 'Navami', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-25 07:59:37'),
(270, '2026-05-01', '2026-05-30', 'Saturday', 'Dashami', 'Krittika', 'गंगा दशहरा', NULL, 'good', 0, '2026-06-25 07:59:37'),
(271, '2026-05-01', '2026-05-31', 'Sunday', 'Ekadashi', 'Krittika', NULL, 'अपरा एकादशी', 'excellent', 0, '2026-06-25 07:59:37'),
(272, '2026-06-27', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(273, '2026-06-27', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(274, '2026-06-27', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-27 07:36:46'),
(275, '2026-06-27', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-27 07:36:46'),
(276, '2026-06-27', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(277, '2026-06-27', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-27 07:36:46'),
(278, '2026-06-27', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(279, '2026-06-27', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(280, '2026-06-27', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-27 07:36:46'),
(281, '2026-06-27', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(282, '2026-06-27', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-27 07:36:46'),
(283, '2026-06-27', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(284, '2026-06-27', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-27 07:36:46'),
(285, '2026-06-27', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-27 07:36:46'),
(286, '2026-06-27', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-27 07:36:46'),
(287, '2026-06-27', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-27 07:36:46'),
(288, '2026-06-27', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-27 07:36:46'),
(289, '2026-06-27', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-27 07:36:46'),
(290, '2026-06-27', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(291, '2026-06-27', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(292, '2026-06-27', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-27 07:36:46'),
(293, '2026-06-27', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-27 07:36:46'),
(294, '2026-06-27', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(295, '2026-06-27', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(296, '2026-06-27', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-27 07:36:46'),
(297, '2026-06-27', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-27 07:36:46'),
(298, '2026-06-27', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 1, '2026-06-27 07:36:46'),
(299, '2026-06-27', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-27 07:36:46'),
(300, '2026-06-27', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-27 07:36:46'),
(301, '2026-06-27', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-27 07:36:46'),
(302, '2026-06-28', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-28 14:28:48'),
(303, '2026-06-28', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-28 14:28:48'),
(304, '2026-06-28', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-28 14:28:48'),
(305, '2026-06-28', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-28 14:28:48'),
(306, '2026-06-28', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-28 14:28:48'),
(307, '2026-06-28', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-28 14:28:48'),
(308, '2026-06-28', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-28 14:28:48'),
(309, '2026-06-28', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-28 14:28:48'),
(310, '2026-06-28', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-28 14:28:49'),
(311, '2026-06-28', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-28 14:28:49'),
(312, '2026-06-28', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-28 14:28:49'),
(313, '2026-06-28', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-28 14:28:49'),
(314, '2026-06-28', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-28 14:28:49'),
(315, '2026-06-28', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-28 14:28:49'),
(316, '2026-06-28', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-28 14:28:49'),
(317, '2026-06-28', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-28 14:28:49'),
(318, '2026-06-28', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-28 14:28:49'),
(319, '2026-06-28', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-28 14:28:49'),
(320, '2026-06-28', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-28 14:28:49'),
(321, '2026-06-28', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-28 14:28:49'),
(322, '2026-06-28', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-28 14:28:49'),
(323, '2026-06-28', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-28 14:28:49'),
(324, '2026-06-28', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-28 14:28:49'),
(325, '2026-06-28', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-28 14:28:49'),
(326, '2026-06-28', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-28 14:28:49'),
(327, '2026-06-28', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-28 14:28:49'),
(328, '2026-06-28', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-28 14:28:49'),
(329, '2026-06-28', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 1, '2026-06-28 14:28:49'),
(330, '2026-06-28', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-28 14:28:49'),
(331, '2026-06-28', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 0, '2026-06-28 14:28:49'),
(332, '2026-06-30', '2026-06-01', 'Monday', 'Pratipada', 'Rohini', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(333, '2026-06-30', '2026-06-02', 'Tuesday', 'Dwitiya', 'Mrigashira', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(334, '2026-06-30', '2026-06-03', 'Wednesday', 'Tritiya', 'Ardra', NULL, NULL, 'average', 0, '2026-06-30 12:18:49'),
(335, '2026-06-30', '2026-06-04', 'Thursday', 'Chaturthi', 'Punarvasu', NULL, NULL, 'excellent', 0, '2026-06-30 12:18:49'),
(336, '2026-06-30', '2026-06-05', 'Friday', 'Panchami', 'Pushya', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(337, '2026-06-30', '2026-06-06', 'Saturday', 'Shashthi', 'Ashlesha', NULL, NULL, 'avoid', 0, '2026-06-30 12:18:49'),
(338, '2026-06-30', '2026-06-07', 'Sunday', 'Saptami', 'Magha', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(339, '2026-06-30', '2026-06-08', 'Monday', 'Ashtami', 'Purva Phalguni', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(340, '2026-06-30', '2026-06-09', 'Tuesday', 'Navami', 'Uttara Phalguni', NULL, NULL, 'avoid', 0, '2026-06-30 12:18:49'),
(341, '2026-06-30', '2026-06-10', 'Wednesday', 'Dashami', 'Hasta', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(342, '2026-06-30', '2026-06-11', 'Thursday', 'Ekadashi', 'Chitra', 'Nirjala Ekadashi', 'Nirjala Ekadashi', 'excellent', 0, '2026-06-30 12:18:49'),
(343, '2026-06-30', '2026-06-12', 'Friday', 'Dwadashi', 'Swati', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(344, '2026-06-30', '2026-06-13', 'Saturday', 'Trayodashi', 'Vishakha', NULL, NULL, 'avoid', 0, '2026-06-30 12:18:49'),
(345, '2026-06-30', '2026-06-14', 'Sunday', 'Chaturdashi', 'Anuradha', NULL, NULL, 'avoid', 0, '2026-06-30 12:18:49'),
(346, '2026-06-30', '2026-06-15', 'Monday', 'Amavasya', 'Jyeshtha', 'Vat Purnima', NULL, 'average', 0, '2026-06-30 12:18:49'),
(347, '2026-06-30', '2026-06-16', 'Tuesday', 'Pratipada', 'Mula', NULL, NULL, 'average', 0, '2026-06-30 12:18:49'),
(348, '2026-06-30', '2026-06-17', 'Wednesday', 'Dwitiya', 'Purva Ashadha', NULL, NULL, 'avoid', 0, '2026-06-30 12:18:49'),
(349, '2026-06-30', '2026-06-18', 'Thursday', 'Tritiya', 'Uttara Ashadha', NULL, NULL, 'avoid', 0, '2026-06-30 12:18:49'),
(350, '2026-06-30', '2026-06-19', 'Friday', 'Chaturthi', 'Shravana', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(351, '2026-06-30', '2026-06-20', 'Saturday', 'Panchami', 'Dhanishtha', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(352, '2026-06-30', '2026-06-21', 'Sunday', 'Shashthi', 'Shatabhisha', 'Ratha Yatra', NULL, 'avoid', 0, '2026-06-30 12:18:49'),
(353, '2026-06-30', '2026-06-22', 'Monday', 'Saptami', 'Purva Bhadrapada', NULL, NULL, 'average', 0, '2026-06-30 12:18:49'),
(354, '2026-06-30', '2026-06-23', 'Tuesday', 'Ashtami', 'Uttara Bhadrapada', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(355, '2026-06-30', '2026-06-24', 'Wednesday', 'Navami', 'Revati', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(356, '2026-06-30', '2026-06-25', 'Thursday', 'Dashami', 'Ashwini', NULL, 'Ashadha Krishna Ekadashi', 'avoid', 0, '2026-06-30 12:18:49'),
(357, '2026-06-30', '2026-06-26', 'Friday', 'Ekadashi', 'Bharani', NULL, NULL, 'avoid', 0, '2026-06-30 12:18:49'),
(358, '2026-06-30', '2026-06-27', 'Saturday', 'Dwadashi', 'Krittika', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(359, '2026-06-30', '2026-06-28', 'Sunday', 'Trayodashi', 'Rohini', NULL, NULL, 'good', 0, '2026-06-30 12:18:49'),
(360, '2026-06-30', '2026-06-29', 'Monday', 'Chaturdashi', 'Mrigashira', NULL, NULL, 'excellent', 0, '2026-06-30 12:18:49'),
(361, '2026-06-30', '2026-06-30', 'Tuesday', 'Purnima', 'Ardra', 'Guru Purnima', NULL, 'excellent', 1, '2026-06-30 12:18:49'),
(362, '2026-07-01', '2026-07-01', 'Wednesday', 'प्रतिपदा', 'उत्तरा फाल्गुनी', NULL, NULL, 'average', 1, '2026-07-01 06:01:58'),
(363, '2026-07-01', '2026-07-02', 'Thursday', 'द्वितीया', 'हस्त', NULL, NULL, 'good', 0, '2026-07-01 06:01:58'),
(364, '2026-07-01', '2026-07-03', 'Friday', 'तृतीया', 'चित्रा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(365, '2026-07-01', '2026-07-04', 'Saturday', 'चतुर्थी', 'स्वाती', NULL, NULL, 'avoid', 0, '2026-07-01 06:01:58'),
(366, '2026-07-01', '2026-07-05', 'Sunday', 'पंचमी', 'विशाखा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(367, '2026-07-01', '2026-07-06', 'Monday', 'षष्ठी', 'अनुराधा', 'गुरु पूर्णिमा', 'गुरु पूर्णिमा व्रत', 'excellent', 0, '2026-07-01 06:01:58'),
(368, '2026-07-01', '2026-07-07', 'Tuesday', 'प्रतिपदा', 'ज्येष्ठा', 'श्रावण मास शुरू', 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-01 06:01:58'),
(369, '2026-07-01', '2026-07-08', 'Wednesday', 'द्वितीया', 'मूल', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(370, '2026-07-01', '2026-07-09', 'Thursday', 'तृतीया', 'पूर्वाषाढा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(371, '2026-07-01', '2026-07-10', 'Friday', 'चतुर्थी', 'उत्तराषाढा', NULL, NULL, 'avoid', 0, '2026-07-01 06:01:58'),
(372, '2026-07-01', '2026-07-11', 'Saturday', 'पंचमी', 'श्रवण', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(373, '2026-07-01', '2026-07-12', 'Sunday', 'षष्ठी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(374, '2026-07-01', '2026-07-13', 'Monday', 'सप्तमी', 'शतभिषा', NULL, 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-01 06:01:58'),
(375, '2026-07-01', '2026-07-14', 'Tuesday', 'अष्टमी', 'पूर्वभाद्रपदा', NULL, NULL, 'avoid', 0, '2026-07-01 06:01:58'),
(376, '2026-07-01', '2026-07-15', 'Wednesday', 'नवमी', 'उत्तरभाद्रपदा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(377, '2026-07-01', '2026-07-16', 'Thursday', 'दशमी', 'रेवती', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(378, '2026-07-01', '2026-07-17', 'Friday', 'एकादशी', 'अश्विनी', NULL, 'पुत्रदा एकादशी', 'excellent', 0, '2026-07-01 06:01:58'),
(379, '2026-07-01', '2026-07-18', 'Saturday', 'द्वादशी', 'भरणी', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(380, '2026-07-01', '2026-07-19', 'Sunday', 'त्रयोदशी', 'कृत्तिका', NULL, NULL, 'good', 0, '2026-07-01 06:01:58'),
(381, '2026-07-01', '2026-07-20', 'Monday', 'चतुर्दशी', 'रोहिणी', NULL, 'श्रावण सोमवार व्रत', 'avoid', 0, '2026-07-01 06:01:58'),
(382, '2026-07-01', '2026-07-21', 'Tuesday', 'पूर्णिमा', 'मृगशीर्ष', 'रक्षा बंधन', NULL, 'excellent', 0, '2026-07-01 06:01:58'),
(383, '2026-07-01', '2026-07-22', 'Wednesday', 'प्रतिपदा', 'आर्द्रा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(384, '2026-07-01', '2026-07-23', 'Thursday', 'द्वितीया', 'पुनर्वसु', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(385, '2026-07-01', '2026-07-24', 'Friday', 'तृतीया', 'पुष्य', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(386, '2026-07-01', '2026-07-25', 'Saturday', 'चतुर्थी', 'आश्लेषा', NULL, NULL, 'avoid', 0, '2026-07-01 06:01:58'),
(387, '2026-07-01', '2026-07-26', 'Sunday', 'पंचमी', 'मूल', NULL, NULL, 'avoid', 0, '2026-07-01 06:01:58'),
(388, '2026-07-01', '2026-07-27', 'Monday', 'षष्ठी', 'पूर्वाषाढा', NULL, 'श्रावण सोमवार व्रत', 'good', 0, '2026-07-01 06:01:58'),
(389, '2026-07-01', '2026-07-28', 'Tuesday', 'सप्तमी', 'उत्तराषाढा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(390, '2026-07-01', '2026-07-29', 'Wednesday', 'अष्टमी', 'श्रवण', 'श्री कृष्ण जन्माष्टमी', NULL, 'excellent', 0, '2026-07-01 06:01:58'),
(391, '2026-07-01', '2026-07-30', 'Thursday', 'नवमी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(392, '2026-07-01', '2026-07-31', 'Friday', 'दशमी', 'शतभिषा', NULL, NULL, 'average', 0, '2026-07-01 06:01:58'),
(393, '2026-07-09', '2026-07-01', 'Wednesday', 'प्रतिपदा', 'उत्तरा फाल्गुनी', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(394, '2026-07-09', '2026-07-02', 'Thursday', 'द्वितीया', 'हस्त', NULL, NULL, 'good', 0, '2026-07-09 08:13:40'),
(395, '2026-07-09', '2026-07-03', 'Friday', 'तृतीया', 'चित्रा', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(396, '2026-07-09', '2026-07-04', 'Saturday', 'चतुर्थी', 'स्वाती', NULL, NULL, 'avoid', 0, '2026-07-09 08:13:40'),
(397, '2026-07-09', '2026-07-05', 'Sunday', 'पंचमी', 'विशाखा', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(398, '2026-07-09', '2026-07-06', 'Monday', 'षष्ठी', 'अनुराधा', 'गुरु पूर्णिमा', 'गुरु पूर्णिमा व्रत', 'excellent', 0, '2026-07-09 08:13:40'),
(399, '2026-07-09', '2026-07-07', 'Tuesday', 'प्रतिपदा', 'ज्येष्ठा', 'श्रावण मास शुरू', 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-09 08:13:40'),
(400, '2026-07-09', '2026-07-08', 'Wednesday', 'द्वितीया', 'मूल', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(401, '2026-07-09', '2026-07-09', 'Thursday', 'तृतीया', 'पूर्वाषाढा', NULL, NULL, 'average', 1, '2026-07-09 08:13:40'),
(402, '2026-07-09', '2026-07-10', 'Friday', 'चतुर्थी', 'उत्तराषाढा', NULL, NULL, 'avoid', 0, '2026-07-09 08:13:40'),
(403, '2026-07-09', '2026-07-11', 'Saturday', 'पंचमी', 'श्रवण', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(404, '2026-07-09', '2026-07-12', 'Sunday', 'षष्ठी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(405, '2026-07-09', '2026-07-13', 'Monday', 'सप्तमी', 'शतभिषा', NULL, 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-09 08:13:40'),
(406, '2026-07-09', '2026-07-14', 'Tuesday', 'अष्टमी', 'पूर्वभाद्रपदा', NULL, NULL, 'avoid', 0, '2026-07-09 08:13:40'),
(407, '2026-07-09', '2026-07-15', 'Wednesday', 'नवमी', 'उत्तरभाद्रपदा', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(408, '2026-07-09', '2026-07-16', 'Thursday', 'दशमी', 'रेवती', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(409, '2026-07-09', '2026-07-17', 'Friday', 'एकादशी', 'अश्विनी', NULL, 'पुत्रदा एकादशी', 'excellent', 0, '2026-07-09 08:13:40'),
(410, '2026-07-09', '2026-07-18', 'Saturday', 'द्वादशी', 'भरणी', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(411, '2026-07-09', '2026-07-19', 'Sunday', 'त्रयोदशी', 'कृत्तिका', NULL, NULL, 'good', 0, '2026-07-09 08:13:40'),
(412, '2026-07-09', '2026-07-20', 'Monday', 'चतुर्दशी', 'रोहिणी', NULL, 'श्रावण सोमवार व्रत', 'avoid', 0, '2026-07-09 08:13:40'),
(413, '2026-07-09', '2026-07-21', 'Tuesday', 'पूर्णिमा', 'मृगशीर्ष', 'रक्षा बंधन', NULL, 'excellent', 0, '2026-07-09 08:13:40'),
(414, '2026-07-09', '2026-07-22', 'Wednesday', 'प्रतिपदा', 'आर्द्रा', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(415, '2026-07-09', '2026-07-23', 'Thursday', 'द्वितीया', 'पुनर्वसु', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(416, '2026-07-09', '2026-07-24', 'Friday', 'तृतीया', 'पुष्य', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(417, '2026-07-09', '2026-07-25', 'Saturday', 'चतुर्थी', 'आश्लेषा', NULL, NULL, 'avoid', 0, '2026-07-09 08:13:40'),
(418, '2026-07-09', '2026-07-26', 'Sunday', 'पंचमी', 'मूल', NULL, NULL, 'avoid', 0, '2026-07-09 08:13:40'),
(419, '2026-07-09', '2026-07-27', 'Monday', 'षष्ठी', 'पूर्वाषाढा', NULL, 'श्रावण सोमवार व्रत', 'good', 0, '2026-07-09 08:13:40'),
(420, '2026-07-09', '2026-07-28', 'Tuesday', 'सप्तमी', 'उत्तराषाढा', NULL, NULL, 'average', 0, '2026-07-09 08:13:40');
INSERT INTO `panchang_month_dates` (`id`, `panchang_date`, `date`, `day`, `tithi`, `nakshatra`, `festival`, `vrat`, `auspicious`, `is_selected_date`, `created_at`) VALUES
(421, '2026-07-09', '2026-07-29', 'Wednesday', 'अष्टमी', 'श्रवण', 'श्री कृष्ण जन्माष्टमी', NULL, 'excellent', 0, '2026-07-09 08:13:40'),
(422, '2026-07-09', '2026-07-30', 'Thursday', 'नवमी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(423, '2026-07-09', '2026-07-31', 'Friday', 'दशमी', 'शतभिषा', NULL, NULL, 'average', 0, '2026-07-09 08:13:40'),
(424, '2026-07-20', '2026-07-01', 'Wednesday', 'प्रतिपदा', 'उत्तरा फाल्गुनी', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(425, '2026-07-20', '2026-07-02', 'Thursday', 'द्वितीया', 'हस्त', NULL, NULL, 'good', 0, '2026-07-20 14:52:31'),
(426, '2026-07-20', '2026-07-03', 'Friday', 'तृतीया', 'चित्रा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(427, '2026-07-20', '2026-07-04', 'Saturday', 'चतुर्थी', 'स्वाती', NULL, NULL, 'avoid', 0, '2026-07-20 14:52:31'),
(428, '2026-07-20', '2026-07-05', 'Sunday', 'पंचमी', 'विशाखा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(429, '2026-07-20', '2026-07-06', 'Monday', 'षष्ठी', 'अनुराधा', 'गुरु पूर्णिमा', 'गुरु पूर्णिमा व्रत', 'excellent', 0, '2026-07-20 14:52:31'),
(430, '2026-07-20', '2026-07-07', 'Tuesday', 'प्रतिपदा', 'ज्येष्ठा', 'श्रावण मास शुरू', 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-20 14:52:31'),
(431, '2026-07-20', '2026-07-08', 'Wednesday', 'द्वितीया', 'मूल', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(432, '2026-07-20', '2026-07-09', 'Thursday', 'तृतीया', 'पूर्वाषाढा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(433, '2026-07-20', '2026-07-10', 'Friday', 'चतुर्थी', 'उत्तराषाढा', NULL, NULL, 'avoid', 0, '2026-07-20 14:52:31'),
(434, '2026-07-20', '2026-07-11', 'Saturday', 'पंचमी', 'श्रवण', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(435, '2026-07-20', '2026-07-12', 'Sunday', 'षष्ठी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(436, '2026-07-20', '2026-07-13', 'Monday', 'सप्तमी', 'शतभिषा', NULL, 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-20 14:52:31'),
(437, '2026-07-20', '2026-07-14', 'Tuesday', 'अष्टमी', 'पूर्वभाद्रपदा', NULL, NULL, 'avoid', 0, '2026-07-20 14:52:31'),
(438, '2026-07-20', '2026-07-15', 'Wednesday', 'नवमी', 'उत्तरभाद्रपदा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(439, '2026-07-20', '2026-07-16', 'Thursday', 'दशमी', 'रेवती', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(440, '2026-07-20', '2026-07-17', 'Friday', 'एकादशी', 'अश्विनी', NULL, 'पुत्रदा एकादशी', 'excellent', 0, '2026-07-20 14:52:31'),
(441, '2026-07-20', '2026-07-18', 'Saturday', 'द्वादशी', 'भरणी', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(442, '2026-07-20', '2026-07-19', 'Sunday', 'त्रयोदशी', 'कृत्तिका', NULL, NULL, 'good', 0, '2026-07-20 14:52:31'),
(443, '2026-07-20', '2026-07-20', 'Monday', 'चतुर्दशी', 'रोहिणी', NULL, 'श्रावण सोमवार व्रत', 'avoid', 1, '2026-07-20 14:52:31'),
(444, '2026-07-20', '2026-07-21', 'Tuesday', 'पूर्णिमा', 'मृगशीर्ष', 'रक्षा बंधन', NULL, 'excellent', 0, '2026-07-20 14:52:31'),
(445, '2026-07-20', '2026-07-22', 'Wednesday', 'प्रतिपदा', 'आर्द्रा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(446, '2026-07-20', '2026-07-23', 'Thursday', 'द्वितीया', 'पुनर्वसु', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(447, '2026-07-20', '2026-07-24', 'Friday', 'तृतीया', 'पुष्य', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(448, '2026-07-20', '2026-07-25', 'Saturday', 'चतुर्थी', 'आश्लेषा', NULL, NULL, 'avoid', 0, '2026-07-20 14:52:31'),
(449, '2026-07-20', '2026-07-26', 'Sunday', 'पंचमी', 'मूल', NULL, NULL, 'avoid', 0, '2026-07-20 14:52:31'),
(450, '2026-07-20', '2026-07-27', 'Monday', 'षष्ठी', 'पूर्वाषाढा', NULL, 'श्रावण सोमवार व्रत', 'good', 0, '2026-07-20 14:52:31'),
(451, '2026-07-20', '2026-07-28', 'Tuesday', 'सप्तमी', 'उत्तराषाढा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(452, '2026-07-20', '2026-07-29', 'Wednesday', 'अष्टमी', 'श्रवण', 'श्री कृष्ण जन्माष्टमी', NULL, 'excellent', 0, '2026-07-20 14:52:31'),
(453, '2026-07-20', '2026-07-30', 'Thursday', 'नवमी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(454, '2026-07-20', '2026-07-31', 'Friday', 'दशमी', 'शतभिषा', NULL, NULL, 'average', 0, '2026-07-20 14:52:31'),
(455, '2026-07-21', '2026-07-01', 'Wednesday', 'प्रतिपदा', 'उत्तरा फाल्गुनी', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(456, '2026-07-21', '2026-07-02', 'Thursday', 'द्वितीया', 'हस्त', NULL, NULL, 'good', 0, '2026-07-21 04:12:18'),
(457, '2026-07-21', '2026-07-03', 'Friday', 'तृतीया', 'चित्रा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(458, '2026-07-21', '2026-07-04', 'Saturday', 'चतुर्थी', 'स्वाती', NULL, NULL, 'avoid', 0, '2026-07-21 04:12:18'),
(459, '2026-07-21', '2026-07-05', 'Sunday', 'पंचमी', 'विशाखा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(460, '2026-07-21', '2026-07-06', 'Monday', 'षष्ठी', 'अनुराधा', 'गुरु पूर्णिमा', 'गुरु पूर्णिमा व्रत', 'excellent', 0, '2026-07-21 04:12:18'),
(461, '2026-07-21', '2026-07-07', 'Tuesday', 'प्रतिपदा', 'ज्येष्ठा', 'श्रावण मास शुरू', 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-21 04:12:18'),
(462, '2026-07-21', '2026-07-08', 'Wednesday', 'द्वितीया', 'मूल', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(463, '2026-07-21', '2026-07-09', 'Thursday', 'तृतीया', 'पूर्वाषाढा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(464, '2026-07-21', '2026-07-10', 'Friday', 'चतुर्थी', 'उत्तराषाढा', NULL, NULL, 'avoid', 0, '2026-07-21 04:12:18'),
(465, '2026-07-21', '2026-07-11', 'Saturday', 'पंचमी', 'श्रवण', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(466, '2026-07-21', '2026-07-12', 'Sunday', 'षष्ठी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(467, '2026-07-21', '2026-07-13', 'Monday', 'सप्तमी', 'शतभिषा', NULL, 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-21 04:12:18'),
(468, '2026-07-21', '2026-07-14', 'Tuesday', 'अष्टमी', 'पूर्वभाद्रपदा', NULL, NULL, 'avoid', 0, '2026-07-21 04:12:18'),
(469, '2026-07-21', '2026-07-15', 'Wednesday', 'नवमी', 'उत्तरभाद्रपदा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(470, '2026-07-21', '2026-07-16', 'Thursday', 'दशमी', 'रेवती', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(471, '2026-07-21', '2026-07-17', 'Friday', 'एकादशी', 'अश्विनी', NULL, 'पुत्रदा एकादशी', 'excellent', 0, '2026-07-21 04:12:18'),
(472, '2026-07-21', '2026-07-18', 'Saturday', 'द्वादशी', 'भरणी', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(473, '2026-07-21', '2026-07-19', 'Sunday', 'त्रयोदशी', 'कृत्तिका', NULL, NULL, 'good', 0, '2026-07-21 04:12:18'),
(474, '2026-07-21', '2026-07-20', 'Monday', 'चतुर्दशी', 'रोहिणी', NULL, 'श्रावण सोमवार व्रत', 'avoid', 0, '2026-07-21 04:12:18'),
(475, '2026-07-21', '2026-07-21', 'Tuesday', 'पूर्णिमा', 'मृगशीर्ष', 'रक्षा बंधन', NULL, 'excellent', 1, '2026-07-21 04:12:18'),
(476, '2026-07-21', '2026-07-22', 'Wednesday', 'प्रतिपदा', 'आर्द्रा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(477, '2026-07-21', '2026-07-23', 'Thursday', 'द्वितीया', 'पुनर्वसु', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(478, '2026-07-21', '2026-07-24', 'Friday', 'तृतीया', 'पुष्य', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(479, '2026-07-21', '2026-07-25', 'Saturday', 'चतुर्थी', 'आश्लेषा', NULL, NULL, 'avoid', 0, '2026-07-21 04:12:18'),
(480, '2026-07-21', '2026-07-26', 'Sunday', 'पंचमी', 'मूल', NULL, NULL, 'avoid', 0, '2026-07-21 04:12:18'),
(481, '2026-07-21', '2026-07-27', 'Monday', 'षष्ठी', 'पूर्वाषाढा', NULL, 'श्रावण सोमवार व्रत', 'good', 0, '2026-07-21 04:12:18'),
(482, '2026-07-21', '2026-07-28', 'Tuesday', 'सप्तमी', 'उत्तराषाढा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(483, '2026-07-21', '2026-07-29', 'Wednesday', 'अष्टमी', 'श्रवण', 'श्री कृष्ण जन्माष्टमी', NULL, 'excellent', 0, '2026-07-21 04:12:18'),
(484, '2026-07-21', '2026-07-30', 'Thursday', 'नवमी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(485, '2026-07-21', '2026-07-31', 'Friday', 'दशमी', 'शतभिषा', NULL, NULL, 'average', 0, '2026-07-21 04:12:18'),
(486, '2026-07-22', '2026-07-01', 'Wednesday', 'प्रतिपदा', 'उत्तरा फाल्गुनी', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(487, '2026-07-22', '2026-07-02', 'Thursday', 'द्वितीया', 'हस्त', NULL, NULL, 'good', 0, '2026-07-21 14:33:04'),
(488, '2026-07-22', '2026-07-03', 'Friday', 'तृतीया', 'चित्रा', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(489, '2026-07-22', '2026-07-04', 'Saturday', 'चतुर्थी', 'स्वाती', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:04'),
(490, '2026-07-22', '2026-07-05', 'Sunday', 'पंचमी', 'विशाखा', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(491, '2026-07-22', '2026-07-06', 'Monday', 'षष्ठी', 'अनुराधा', 'गुरु पूर्णिमा', 'गुरु पूर्णिमा व्रत', 'excellent', 0, '2026-07-21 14:33:04'),
(492, '2026-07-22', '2026-07-07', 'Tuesday', 'प्रतिपदा', 'ज्येष्ठा', 'श्रावण मास शुरू', 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-21 14:33:04'),
(493, '2026-07-22', '2026-07-08', 'Wednesday', 'द्वितीया', 'मूल', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(494, '2026-07-22', '2026-07-09', 'Thursday', 'तृतीया', 'पूर्वाषाढा', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(495, '2026-07-22', '2026-07-10', 'Friday', 'चतुर्थी', 'उत्तराषाढा', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:04'),
(496, '2026-07-22', '2026-07-11', 'Saturday', 'पंचमी', 'श्रवण', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(497, '2026-07-22', '2026-07-12', 'Sunday', 'षष्ठी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(498, '2026-07-22', '2026-07-13', 'Monday', 'सप्तमी', 'शतभिषा', NULL, 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-21 14:33:04'),
(499, '2026-07-22', '2026-07-14', 'Tuesday', 'अष्टमी', 'पूर्वभाद्रपदा', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:04'),
(500, '2026-07-22', '2026-07-15', 'Wednesday', 'नवमी', 'उत्तरभाद्रपदा', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(501, '2026-07-22', '2026-07-16', 'Thursday', 'दशमी', 'रेवती', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(502, '2026-07-22', '2026-07-17', 'Friday', 'एकादशी', 'अश्विनी', NULL, 'पुत्रदा एकादशी', 'excellent', 0, '2026-07-21 14:33:04'),
(503, '2026-07-22', '2026-07-18', 'Saturday', 'द्वादशी', 'भरणी', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(504, '2026-07-22', '2026-07-19', 'Sunday', 'त्रयोदशी', 'कृत्तिका', NULL, NULL, 'good', 0, '2026-07-21 14:33:04'),
(505, '2026-07-22', '2026-07-20', 'Monday', 'चतुर्दशी', 'रोहिणी', NULL, 'श्रावण सोमवार व्रत', 'avoid', 0, '2026-07-21 14:33:04'),
(506, '2026-07-22', '2026-07-21', 'Tuesday', 'पूर्णिमा', 'मृगशीर्ष', 'रक्षा बंधन', NULL, 'excellent', 0, '2026-07-21 14:33:04'),
(507, '2026-07-22', '2026-07-22', 'Wednesday', 'प्रतिपदा', 'आर्द्रा', NULL, NULL, 'average', 1, '2026-07-21 14:33:04'),
(508, '2026-07-22', '2026-07-23', 'Thursday', 'द्वितीया', 'पुनर्वसु', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(509, '2026-07-22', '2026-07-24', 'Friday', 'तृतीया', 'पुष्य', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(510, '2026-07-22', '2026-07-25', 'Saturday', 'चतुर्थी', 'आश्लेषा', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:04'),
(511, '2026-07-22', '2026-07-26', 'Sunday', 'पंचमी', 'मूल', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:04'),
(512, '2026-07-22', '2026-07-27', 'Monday', 'षष्ठी', 'पूर्वाषाढा', NULL, 'श्रावण सोमवार व्रत', 'good', 0, '2026-07-21 14:33:04'),
(513, '2026-07-22', '2026-07-28', 'Tuesday', 'सप्तमी', 'उत्तराषाढा', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(514, '2026-07-22', '2026-07-29', 'Wednesday', 'अष्टमी', 'श्रवण', 'श्री कृष्ण जन्माष्टमी', NULL, 'excellent', 0, '2026-07-21 14:33:04'),
(515, '2026-07-22', '2026-07-30', 'Thursday', 'नवमी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(516, '2026-07-22', '2026-07-31', 'Friday', 'दशमी', 'शतभिषा', NULL, NULL, 'average', 0, '2026-07-21 14:33:04'),
(517, '2026-07-26', '2026-07-01', 'Wednesday', 'प्रतिपदा', 'उत्तरा फाल्गुनी', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(518, '2026-07-26', '2026-07-02', 'Thursday', 'द्वितीया', 'हस्त', NULL, NULL, 'good', 0, '2026-07-21 14:33:09'),
(519, '2026-07-26', '2026-07-03', 'Friday', 'तृतीया', 'चित्रा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(520, '2026-07-26', '2026-07-04', 'Saturday', 'चतुर्थी', 'स्वाती', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:09'),
(521, '2026-07-26', '2026-07-05', 'Sunday', 'पंचमी', 'विशाखा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(522, '2026-07-26', '2026-07-06', 'Monday', 'षष्ठी', 'अनुराधा', 'गुरु पूर्णिमा', 'गुरु पूर्णिमा व्रत', 'excellent', 0, '2026-07-21 14:33:09'),
(523, '2026-07-26', '2026-07-07', 'Tuesday', 'प्रतिपदा', 'ज्येष्ठा', 'श्रावण मास शुरू', 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-21 14:33:09'),
(524, '2026-07-26', '2026-07-08', 'Wednesday', 'द्वितीया', 'मूल', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(525, '2026-07-26', '2026-07-09', 'Thursday', 'तृतीया', 'पूर्वाषाढा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(526, '2026-07-26', '2026-07-10', 'Friday', 'चतुर्थी', 'उत्तराषाढा', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:09'),
(527, '2026-07-26', '2026-07-11', 'Saturday', 'पंचमी', 'श्रवण', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(528, '2026-07-26', '2026-07-12', 'Sunday', 'षष्ठी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(529, '2026-07-26', '2026-07-13', 'Monday', 'सप्तमी', 'शतभिषा', NULL, 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-21 14:33:09'),
(530, '2026-07-26', '2026-07-14', 'Tuesday', 'अष्टमी', 'पूर्वभाद्रपदा', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:09'),
(531, '2026-07-26', '2026-07-15', 'Wednesday', 'नवमी', 'उत्तरभाद्रपदा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(532, '2026-07-26', '2026-07-16', 'Thursday', 'दशमी', 'रेवती', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(533, '2026-07-26', '2026-07-17', 'Friday', 'एकादशी', 'अश्विनी', NULL, 'पुत्रदा एकादशी', 'excellent', 0, '2026-07-21 14:33:09'),
(534, '2026-07-26', '2026-07-18', 'Saturday', 'द्वादशी', 'भरणी', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(535, '2026-07-26', '2026-07-19', 'Sunday', 'त्रयोदशी', 'कृत्तिका', NULL, NULL, 'good', 0, '2026-07-21 14:33:09'),
(536, '2026-07-26', '2026-07-20', 'Monday', 'चतुर्दशी', 'रोहिणी', NULL, 'श्रावण सोमवार व्रत', 'avoid', 0, '2026-07-21 14:33:09'),
(537, '2026-07-26', '2026-07-21', 'Tuesday', 'पूर्णिमा', 'मृगशीर्ष', 'रक्षा बंधन', NULL, 'excellent', 0, '2026-07-21 14:33:09'),
(538, '2026-07-26', '2026-07-22', 'Wednesday', 'प्रतिपदा', 'आर्द्रा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(539, '2026-07-26', '2026-07-23', 'Thursday', 'द्वितीया', 'पुनर्वसु', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(540, '2026-07-26', '2026-07-24', 'Friday', 'तृतीया', 'पुष्य', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(541, '2026-07-26', '2026-07-25', 'Saturday', 'चतुर्थी', 'आश्लेषा', NULL, NULL, 'avoid', 0, '2026-07-21 14:33:09'),
(542, '2026-07-26', '2026-07-26', 'Sunday', 'पंचमी', 'मूल', NULL, NULL, 'avoid', 1, '2026-07-21 14:33:09'),
(543, '2026-07-26', '2026-07-27', 'Monday', 'षष्ठी', 'पूर्वाषाढा', NULL, 'श्रावण सोमवार व्रत', 'good', 0, '2026-07-21 14:33:09'),
(544, '2026-07-26', '2026-07-28', 'Tuesday', 'सप्तमी', 'उत्तराषाढा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(545, '2026-07-26', '2026-07-29', 'Wednesday', 'अष्टमी', 'श्रवण', 'श्री कृष्ण जन्माष्टमी', NULL, 'excellent', 0, '2026-07-21 14:33:09'),
(546, '2026-07-26', '2026-07-30', 'Thursday', 'नवमी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(547, '2026-07-26', '2026-07-31', 'Friday', 'दशमी', 'शतभिषा', NULL, NULL, 'average', 0, '2026-07-21 14:33:09'),
(548, '2026-07-23', '2026-07-01', 'Wednesday', 'प्रतिपदा', 'उत्तरा फाल्गुनी', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(549, '2026-07-23', '2026-07-02', 'Thursday', 'द्वितीया', 'हस्त', NULL, NULL, 'good', 0, '2026-07-22 12:08:58'),
(550, '2026-07-23', '2026-07-03', 'Friday', 'तृतीया', 'चित्रा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(551, '2026-07-23', '2026-07-04', 'Saturday', 'चतुर्थी', 'स्वाती', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:58'),
(552, '2026-07-23', '2026-07-05', 'Sunday', 'पंचमी', 'विशाखा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(553, '2026-07-23', '2026-07-06', 'Monday', 'षष्ठी', 'अनुराधा', 'गुरु पूर्णिमा', 'गुरु पूर्णिमा व्रत', 'excellent', 0, '2026-07-22 12:08:58'),
(554, '2026-07-23', '2026-07-07', 'Tuesday', 'प्रतिपदा', 'ज्येष्ठा', 'श्रावण मास शुरू', 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-22 12:08:58'),
(555, '2026-07-23', '2026-07-08', 'Wednesday', 'द्वितीया', 'मूल', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(556, '2026-07-23', '2026-07-09', 'Thursday', 'तृतीया', 'पूर्वाषाढा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(557, '2026-07-23', '2026-07-10', 'Friday', 'चतुर्थी', 'उत्तराषाढा', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:58'),
(558, '2026-07-23', '2026-07-11', 'Saturday', 'पंचमी', 'श्रवण', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(559, '2026-07-23', '2026-07-12', 'Sunday', 'षष्ठी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(560, '2026-07-23', '2026-07-13', 'Monday', 'सप्तमी', 'शतभिषा', NULL, 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-22 12:08:58'),
(561, '2026-07-23', '2026-07-14', 'Tuesday', 'अष्टमी', 'पूर्वभाद्रपदा', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:58'),
(562, '2026-07-23', '2026-07-15', 'Wednesday', 'नवमी', 'उत्तरभाद्रपदा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(563, '2026-07-23', '2026-07-16', 'Thursday', 'दशमी', 'रेवती', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(564, '2026-07-23', '2026-07-17', 'Friday', 'एकादशी', 'अश्विनी', NULL, 'पुत्रदा एकादशी', 'excellent', 0, '2026-07-22 12:08:58'),
(565, '2026-07-23', '2026-07-18', 'Saturday', 'द्वादशी', 'भरणी', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(566, '2026-07-23', '2026-07-19', 'Sunday', 'त्रयोदशी', 'कृत्तिका', NULL, NULL, 'good', 0, '2026-07-22 12:08:58'),
(567, '2026-07-23', '2026-07-20', 'Monday', 'चतुर्दशी', 'रोहिणी', NULL, 'श्रावण सोमवार व्रत', 'avoid', 0, '2026-07-22 12:08:58'),
(568, '2026-07-23', '2026-07-21', 'Tuesday', 'पूर्णिमा', 'मृगशीर्ष', 'रक्षा बंधन', NULL, 'excellent', 0, '2026-07-22 12:08:58'),
(569, '2026-07-23', '2026-07-22', 'Wednesday', 'प्रतिपदा', 'आर्द्रा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(570, '2026-07-23', '2026-07-23', 'Thursday', 'द्वितीया', 'पुनर्वसु', NULL, NULL, 'average', 1, '2026-07-22 12:08:58'),
(571, '2026-07-23', '2026-07-24', 'Friday', 'तृतीया', 'पुष्य', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(572, '2026-07-23', '2026-07-25', 'Saturday', 'चतुर्थी', 'आश्लेषा', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:58'),
(573, '2026-07-23', '2026-07-26', 'Sunday', 'पंचमी', 'मूल', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:58'),
(574, '2026-07-23', '2026-07-27', 'Monday', 'षष्ठी', 'पूर्वाषाढा', NULL, 'श्रावण सोमवार व्रत', 'good', 0, '2026-07-22 12:08:58'),
(575, '2026-07-23', '2026-07-28', 'Tuesday', 'सप्तमी', 'उत्तराषाढा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(576, '2026-07-23', '2026-07-29', 'Wednesday', 'अष्टमी', 'श्रवण', 'श्री कृष्ण जन्माष्टमी', NULL, 'excellent', 0, '2026-07-22 12:08:58'),
(577, '2026-07-23', '2026-07-30', 'Thursday', 'नवमी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(578, '2026-07-23', '2026-07-31', 'Friday', 'दशमी', 'शतभिषा', NULL, NULL, 'average', 0, '2026-07-22 12:08:58'),
(579, '2026-07-24', '2026-07-01', 'Wednesday', 'प्रतिपदा', 'उत्तरा फाल्गुनी', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(580, '2026-07-24', '2026-07-02', 'Thursday', 'द्वितीया', 'हस्त', NULL, NULL, 'good', 0, '2026-07-22 12:08:59'),
(581, '2026-07-24', '2026-07-03', 'Friday', 'तृतीया', 'चित्रा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(582, '2026-07-24', '2026-07-04', 'Saturday', 'चतुर्थी', 'स्वाती', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:59'),
(583, '2026-07-24', '2026-07-05', 'Sunday', 'पंचमी', 'विशाखा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(584, '2026-07-24', '2026-07-06', 'Monday', 'षष्ठी', 'अनुराधा', 'गुरु पूर्णिमा', 'गुरु पूर्णिमा व्रत', 'excellent', 0, '2026-07-22 12:08:59'),
(585, '2026-07-24', '2026-07-07', 'Tuesday', 'प्रतिपदा', 'ज्येष्ठा', 'श्रावण मास शुरू', 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-22 12:08:59'),
(586, '2026-07-24', '2026-07-08', 'Wednesday', 'द्वितीया', 'मूल', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(587, '2026-07-24', '2026-07-09', 'Thursday', 'तृतीया', 'पूर्वाषाढा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(588, '2026-07-24', '2026-07-10', 'Friday', 'चतुर्थी', 'उत्तराषाढा', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:59'),
(589, '2026-07-24', '2026-07-11', 'Saturday', 'पंचमी', 'श्रवण', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(590, '2026-07-24', '2026-07-12', 'Sunday', 'षष्ठी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(591, '2026-07-24', '2026-07-13', 'Monday', 'सप्तमी', 'शतभिषा', NULL, 'श्रावण सोमवार व्रत', 'excellent', 0, '2026-07-22 12:08:59'),
(592, '2026-07-24', '2026-07-14', 'Tuesday', 'अष्टमी', 'पूर्वभाद्रपदा', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:59'),
(593, '2026-07-24', '2026-07-15', 'Wednesday', 'नवमी', 'उत्तरभाद्रपदा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(594, '2026-07-24', '2026-07-16', 'Thursday', 'दशमी', 'रेवती', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(595, '2026-07-24', '2026-07-17', 'Friday', 'एकादशी', 'अश्विनी', NULL, 'पुत्रदा एकादशी', 'excellent', 0, '2026-07-22 12:08:59'),
(596, '2026-07-24', '2026-07-18', 'Saturday', 'द्वादशी', 'भरणी', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(597, '2026-07-24', '2026-07-19', 'Sunday', 'त्रयोदशी', 'कृत्तिका', NULL, NULL, 'good', 0, '2026-07-22 12:08:59'),
(598, '2026-07-24', '2026-07-20', 'Monday', 'चतुर्दशी', 'रोहिणी', NULL, 'श्रावण सोमवार व्रत', 'avoid', 0, '2026-07-22 12:08:59'),
(599, '2026-07-24', '2026-07-21', 'Tuesday', 'पूर्णिमा', 'मृगशीर्ष', 'रक्षा बंधन', NULL, 'excellent', 0, '2026-07-22 12:08:59'),
(600, '2026-07-24', '2026-07-22', 'Wednesday', 'प्रतिपदा', 'आर्द्रा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(601, '2026-07-24', '2026-07-23', 'Thursday', 'द्वितीया', 'पुनर्वसु', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(602, '2026-07-24', '2026-07-24', 'Friday', 'तृतीया', 'पुष्य', NULL, NULL, 'average', 1, '2026-07-22 12:08:59'),
(603, '2026-07-24', '2026-07-25', 'Saturday', 'चतुर्थी', 'आश्लेषा', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:59'),
(604, '2026-07-24', '2026-07-26', 'Sunday', 'पंचमी', 'मूल', NULL, NULL, 'avoid', 0, '2026-07-22 12:08:59'),
(605, '2026-07-24', '2026-07-27', 'Monday', 'षष्ठी', 'पूर्वाषाढा', NULL, 'श्रावण सोमवार व्रत', 'good', 0, '2026-07-22 12:08:59'),
(606, '2026-07-24', '2026-07-28', 'Tuesday', 'सप्तमी', 'उत्तराषाढा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(607, '2026-07-24', '2026-07-29', 'Wednesday', 'अष्टमी', 'श्रवण', 'श्री कृष्ण जन्माष्टमी', NULL, 'excellent', 0, '2026-07-22 12:08:59'),
(608, '2026-07-24', '2026-07-30', 'Thursday', 'नवमी', 'धनिष्ठा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59'),
(609, '2026-07-24', '2026-07-31', 'Friday', 'दशमी', 'शतभिषा', NULL, NULL, 'average', 0, '2026-07-22 12:08:59');

-- --------------------------------------------------------

--
-- Table structure for table `referral_histories`
--

CREATE TABLE `referral_histories` (
  `id` bigint(20) NOT NULL,
  `referrer_id` bigint(20) NOT NULL,
  `referred_astrologer_id` bigint(20) NOT NULL,
  `referral_code` varchar(20) DEFAULT NULL,
  `bonus_amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('pending','completed') DEFAULT 'pending',
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `referral_histories`
--

INSERT INTO `referral_histories` (`id`, `referrer_id`, `referred_astrologer_id`, `referral_code`, `bonus_amount`, `status`, `completed_at`, `created_at`) VALUES
(1, 36, 36, 'ASTROE2QI9', 500.00, 'completed', '2026-06-24 10:30:00', '2026-06-20 09:00:00'),
(2, 102, 36, 'REFXYZ456', 300.00, 'pending', NULL, '2026-06-22 11:15:00'),
(3, 103, 36, 'REFLMN789', 750.00, 'completed', '2026-06-24 14:45:00', '2026-06-21 08:20:00'),
(4, 61, 64, 'ASTROG7SDV', 200.00, 'completed', '2026-07-21 20:02:48', '2026-07-21 14:32:48');

-- --------------------------------------------------------

--
-- Table structure for table `referral_settings`
--

CREATE TABLE `referral_settings` (
  `id` bigint(20) NOT NULL,
  `referral_bonus` decimal(10,2) DEFAULT 100.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `referral_settings`
--

INSERT INTO `referral_settings` (`id`, `referral_bonus`, `created_at`, `updated_at`) VALUES
(1, 200.00, '2026-06-22 12:17:30', '2026-06-26 05:37:02');

-- --------------------------------------------------------

--
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `wallet_transaction_id` bigint(20) DEFAULT NULL,
  `call_history_id` int(11) DEFAULT NULL,
  `conversation_id` bigint(20) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `rejection_note` text DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_at` datetime DEFAULT NULL,
  `processed_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `reported_by` enum('user','astrologer') NOT NULL,
  `reporter_user_id` int(11) DEFAULT NULL,
  `reporter_astrologer_id` int(11) DEFAULT NULL,
  `reported_user_id` int(11) DEFAULT NULL,
  `reported_astrologer_id` int(11) DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','reviewed','action_taken','ignored') DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `action_taken` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `reported_by`, `reporter_user_id`, `reporter_astrologer_id`, `reported_user_id`, `reported_astrologer_id`, `reason`, `description`, `status`, `admin_note`, `action_taken`, `created_at`, `updated_at`) VALUES
(1, 'user', 61, NULL, 28, NULL, 'Inappropriate behavior', NULL, 'pending', NULL, NULL, '2026-07-18 13:24:13', '2026-07-18 13:24:13'),
(2, 'user', 28, NULL, NULL, 61, 'Other', NULL, 'pending', 'ok we will check ', 'we check ', '2026-07-18 13:38:57', '2026-07-18 14:32:27');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` bigint(20) NOT NULL,
  `ticket_id` varchar(20) NOT NULL,
  `raised_by` enum('user','astrologer') NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `astrologer_id` bigint(20) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `user_email` varchar(150) DEFAULT NULL,
  `issue` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT 'technical',
  `priority` enum('high','medium','low') DEFAULT 'medium',
  `status` enum('open','in_review','resolved','rejected') DEFAULT 'open',
  `admin_comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `ticket_id`, `raised_by`, `user_id`, `astrologer_id`, `user_name`, `user_phone`, `user_email`, `issue`, `description`, `category`, `priority`, `status`, `admin_comment`, `created_at`, `updated_at`) VALUES
(1, 'TKT000001', 'user', NULL, NULL, '', '9876543210', '', 'Unable to do payment', 'Add cash kr raha tha lekin beech me hi paisa stuck hogya', '', 'high', 'open', NULL, '2026-07-06 11:28:26', '2026-07-06 11:28:26'),
(2, 'TKT000002', 'user', NULL, NULL, '', '9876543210', '', 'Misbehave of astrologer', 'Astrologer ne mere saath badtamizi se baat ki', '', 'high', 'open', NULL, '2026-07-07 04:44:00', '2026-07-07 04:44:00'),
(3, 'TKT000003', 'user', 26, NULL, '', '9876543210', '', 'Unable to do smooth chat', 'feeling lagi ness in chat everything is working slow', '', 'high', 'open', NULL, '2026-07-07 05:06:36', '2026-07-07 05:07:48'),
(4, 'TKT000004', 'user', NULL, NULL, '', '', '', 'Payment issue', 'Payment Kiya paisa hi add nahi hua account me', '', 'high', 'open', NULL, '2026-07-07 05:10:44', '2026-07-07 05:10:44'),
(5, 'TKT000005', 'user', 26, NULL, '', '', '', 'okk', 'ji h has', '', 'high', 'open', NULL, '2026-07-07 05:20:51', '2026-07-07 05:20:51'),
(6, 'TKT000006', 'astrologer', NULL, 61, '', '', '', 'astroo', 'okom', '', 'high', 'open', NULL, '2026-07-07 05:21:32', '2026-07-07 05:21:32'),
(7, 'TKT000007', 'user', 26, NULL, '', '', '', 'Astrologer misbehave with me', 'Astrologer ne paisa liya lekin baat nahi kiya', 'Astrologer Behaviour', 'high', 'open', NULL, '2026-07-07 05:56:30', '2026-07-07 05:56:30'),
(8, 'TKT000008', 'user', 26, NULL, '', '', '', 'Payment stuck', 'Payment stuck in middle', 'Payment Issue', 'high', 'open', NULL, '2026-07-07 05:57:20', '2026-07-07 05:57:20'),
(9, 'TKT000009', 'user', 26, NULL, '', '', '', 'hai isssue paymnet me dekho potman', 'hai to hai ', 'paymentysss', 'high', 'open', NULL, '2026-07-07 06:04:35', '2026-07-07 06:04:35'),
(10, 'TKT000010', 'user', 26, NULL, '', '', '', 'hai isssue paymnet me dekho potman', 'hai to hai ', 'paymentysss', 'high', 'open', NULL, '2026-07-07 06:04:55', '2026-07-07 06:04:55'),
(11, 'TKT000011', 'user', 26, NULL, '', '', '', 'ydydxhhd', 'uddufjjdhchcchhx💐👍😟💐👻👻💐👻💐', 'Payment Issue', 'high', 'open', NULL, '2026-07-07 06:06:08', '2026-07-07 06:06:08'),
(12, 'TKT000012', 'user', 26, NULL, 'Test User', '9876543210', '', 'hai isssue paymnet me dekho potman', 'hai to hai ', 'paymentysss', 'high', 'open', NULL, '2026-07-07 06:11:26', '2026-07-07 06:11:26'),
(13, 'TKT000013', 'user', 26, NULL, 'Test User', '9876543210', '', 'xuuffiifccc', 'ggjxhxjjjfjjdhdjcjccjhchcxHamsterjjhhhhjjj gffdddd', 'Payment Issue', 'high', 'open', NULL, '2026-07-07 06:11:56', '2026-07-07 06:11:56'),
(14, 'TKT000014', 'user', 26, NULL, 'Test User', '9876543210', '', 'hgghhh', 'ccgghhhbb', 'Payment Issue', 'high', 'open', NULL, '2026-07-07 06:25:08', '2026-07-07 06:25:08'),
(15, 'TKT000015', 'user', 26, NULL, 'Test User', '9876543210', '', 'ebrbabvb', 'faarbarb', 'Payment Issue', 'high', 'open', NULL, '2026-07-07 06:25:32', '2026-07-07 07:32:55'),
(16, 'TKT000016', 'user', 26, NULL, 'Test User', '9876543210', '', 'abrarbbg', 'vs wcwcwfc', 'Payment Issue', 'high', 'rejected', 'this is testing for reject ', '2026-07-07 06:25:57', '2026-07-07 07:12:15'),
(17, 'TKT000017', 'user', 26, NULL, 'Test User', '9876543210', '', 'Payment deducted', 'I added ₹500 to my wallet via UPI, amount got deducted from my bank account but wallet balance was not updated', 'Payment Issue', 'high', 'rejected', 'also your request have alredy resove bcz when we are match your utr no then already have sumbites , so again you check your accout . thank you so much  ', '2026-07-07 07:00:11', '2026-07-07 07:15:04'),
(18, 'TKT000018', 'astrologer', NULL, 61, 'Test Astrologer', '9876543210', '', 'Amount deducted', 'Amount deducted but not showing in history screen', 'Payment Issue', 'high', 'open', NULL, '2026-07-07 07:55:46', '2026-07-07 07:55:46'),
(19, 'TKT000019', 'user', 26, NULL, 'Test User', '9876543210', '', 'Hello', 'hello 🤗🤗🤗', 'Payment Issue', 'high', 'open', NULL, '2026-07-07 11:42:43', '2026-07-07 11:42:43'),
(20, 'TKT000020', 'user', 28, NULL, 'Aman', '7458946942', '', 'ffffffff', 'chhnbb', 'Astrologer Behaviour', 'high', 'open', NULL, '2026-07-18 07:25:10', '2026-07-18 08:02:54'),
(21, 'TKT000021', 'astrologer', NULL, 61, 'Test Astrologer', '9876543210', '', 'bahut bekar', 'dggyuu', 'Call/Chat Quality', 'high', 'open', NULL, '2026-07-18 07:57:18', '2026-07-18 07:59:49');

-- --------------------------------------------------------

--
-- Table structure for table `support_ticket_attachments`
--

CREATE TABLE `support_ticket_attachments` (
  `id` bigint(20) NOT NULL,
  `message_id` bigint(20) NOT NULL,
  `ticket_id` bigint(20) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` enum('image','file') DEFAULT 'image',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_ticket_attachments`
--

INSERT INTO `support_ticket_attachments` (`id`, `message_id`, `ticket_id`, `file_url`, `file_name`, `file_type`, `created_at`) VALUES
(1, 10, 10, '/uploads/support/1783404295549-63487866-IMG-20260704-WA0004.jpg.jpeg', '1783404295549-63487866-IMG-20260704-WA0004.jpg.jpeg', 'image', '2026-07-07 06:04:55'),
(2, 12, 12, '/uploads/support/1783404685939-943715017-IMG-20260704-WA0004.jpg.jpeg', '1783404685939-943715017-IMG-20260704-WA0004.jpg.jpeg', 'image', '2026-07-07 06:11:26'),
(3, 12, 12, '/uploads/support/1783404686172-738222341-IMG-20260704-WA0004.jpg.jpeg', '1783404686172-738222341-IMG-20260704-WA0004.jpg.jpeg', 'image', '2026-07-07 06:11:26'),
(4, 14, 14, '/uploads/support/1783405508471-948902851-scaled_1000038218.jpg', '1783405508471-948902851-scaled_1000038218.jpg', 'image', '2026-07-07 06:25:08'),
(5, 15, 15, '/uploads/support/1783405532162-348224841-scaled_1000031957.jpg', '1783405532162-348224841-scaled_1000031957.jpg', 'image', '2026-07-07 06:25:32'),
(6, 16, 16, '/uploads/support/1783405557603-813375861-scaled_1000038218.jpg', '1783405557603-813375861-scaled_1000038218.jpg', 'image', '2026-07-07 06:25:57'),
(7, 16, 16, '/uploads/support/1783405557759-136760544-scaled_1000038218.jpg', '1783405557759-136760544-scaled_1000038218.jpg', 'image', '2026-07-07 06:25:57'),
(8, 16, 16, '/uploads/support/1783405557848-853284617-scaled_1000038218.jpg', '1783405557848-853284617-scaled_1000038218.jpg', 'image', '2026-07-07 06:25:57'),
(9, 17, 17, '/uploads/support/1783407611517-756977294-scaled_1000031957.jpg', '1783407611517-756977294-scaled_1000031957.jpg', 'image', '2026-07-07 07:00:11'),
(10, 28, 15, 'https://root.astrovaaani.com/uploads/1783422984322-IMG-20260704-WA0004.jpg.jpeg', 'IMG-20260704-WA0004.jpg.jpeg', 'image', '2026-07-07 11:16:25'),
(11, 29, 15, 'https://root.astrovaaani.com/uploads/1783423101521-IMG-20260704-WA0006.jpg.jpeg', 'IMG-20260704-WA0006.jpg.jpeg', 'image', '2026-07-07 11:18:21'),
(12, 30, 15, 'https://root.astrovaaani.com/uploads/1783423324587-IMG-20260704-WA0007.jpg.jpeg', 'IMG-20260704-WA0007.jpg.jpeg', 'image', '2026-07-07 11:22:04'),
(13, 31, 15, 'https://root.astrovaaani.com/uploads/1783423459027-IMG-20260704-WA0008.jpg.jpeg', 'IMG-20260704-WA0008.jpg.jpeg', 'image', '2026-07-07 11:24:19'),
(14, 32, 15, 'https://root.astrovaaani.com/uploads/1783423542834-IMG-20260704-WA0005.jpg.jpeg', 'IMG-20260704-WA0005.jpg.jpeg', 'image', '2026-07-07 11:25:43'),
(15, 33, 15, '1783423623528-IMG-20260704-WA0007.jpg.jpeg', 'IMG-20260704-WA0007.jpg.jpeg', 'image', '2026-07-07 11:27:04'),
(16, 34, 15, '1783424001405-IMG-20260704-WA0007.jpg.jpeg', 'IMG-20260704-WA0007.jpg.jpeg', 'image', '2026-07-07 11:33:21'),
(17, 35, 14, 'https://root.astrovaaani.com/uploads/1783424521224-puja (2).png', 'puja (2).png', 'image', '2026-07-07 11:42:01'),
(18, 36, 19, '/uploads/support/1783424563487-55511911-scaled_1000038257.jpg', '1783424563487-55511911-scaled_1000038257.jpg', 'image', '2026-07-07 11:42:43'),
(19, 38, 19, 'https://root.astrovaaani.com/uploads/1783424704875-puja (1).png', 'puja (1).png', 'image', '2026-07-07 11:45:04'),
(20, 39, 19, 'https://root.astrovaaani.com/uploads/1783424759930-kalash (1).png', 'kalash (1).png', 'image', '2026-07-07 11:46:00'),
(21, 41, 19, '1783425927844-scaled_1000038257.jpg', 'file', 'image', '2026-07-07 12:05:28'),
(22, 46, 20, '1784360186394-scaled_1000041094.jpg', 'file', 'image', '2026-07-18 07:36:28'),
(23, 47, 20, 'https://root.astrovaaani.com/uploads/1784360208605-WhatsApp Image 2026-07-15 at 10.42.05 AM (1).jpeg', 'WhatsApp Image 2026-07-15 at 10.42.05 AM (1).jpeg', 'image', '2026-07-18 07:36:49'),
(24, 49, 20, '1784360421538-scaled_1000041094.jpg', 'file', 'image', '2026-07-18 07:40:22'),
(25, 50, 20, '1784360556747-scaled_1000041094.jpg', 'file', 'image', '2026-07-18 07:42:39'),
(26, 51, 20, 'https://root.astrovaaani.com/uploads/1784360643936-scaled_1000041094.jpg', 'file', 'image', '2026-07-18 07:44:05'),
(27, 58, 21, '1784361900557-scaled_17215.jpg', 'file', 'image', '2026-07-18 08:05:01'),
(28, 59, 21, 'https://root.astrovaaani.com/uploads/1784361909368-WhatsApp Image 2026-07-15 at 10.42.03 AM.jpeg', 'WhatsApp Image 2026-07-15 at 10.42.03 AM.jpeg', 'image', '2026-07-18 08:05:13'),
(29, 60, 21, 'https://root.astrovaaani.com/uploads/1784362027495-scaled_17215.jpg', 'file', 'image', '2026-07-18 08:07:09');

-- --------------------------------------------------------

--
-- Table structure for table `support_ticket_messages`
--

CREATE TABLE `support_ticket_messages` (
  `id` bigint(20) NOT NULL,
  `ticket_id` bigint(20) NOT NULL,
  `from_type` enum('user','astrologer','admin') NOT NULL,
  `sender_name` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_ticket_messages`
--

INSERT INTO `support_ticket_messages` (`id`, `ticket_id`, `from_type`, `sender_name`, `message`, `sent_at`, `is_read`) VALUES
(1, 1, 'user', 'User', 'Add cash kr raha tha lekin beech me hi paisa stuck hogya', '2026-07-06 11:28:26', 0),
(2, 2, 'user', 'User', 'Astrologer ne mere saath badtamizi se baat ki', '2026-07-07 04:44:00', 0),
(3, 3, 'user', 'User', 'feeling lagi ness in chat everything is working slow', '2026-07-07 05:06:36', 0),
(4, 4, 'user', 'User', 'Payment Kiya paisa hi add nahi hua account me', '2026-07-07 05:10:44', 0),
(5, 5, 'user', 'User', 'ji h has', '2026-07-07 05:20:51', 0),
(6, 6, 'astrologer', 'User', 'okom', '2026-07-07 05:21:32', 0),
(7, 7, 'user', 'User', 'Astrologer ne paisa liya lekin baat nahi kiya', '2026-07-07 05:56:30', 0),
(8, 8, 'user', 'User', 'Payment stuck in middle', '2026-07-07 05:57:20', 0),
(9, 9, 'user', 'User', 'hai to hai ', '2026-07-07 06:04:35', 0),
(10, 10, 'user', 'User', 'hai to hai ', '2026-07-07 06:04:55', 0),
(11, 11, 'user', 'User', 'uddufjjdhchcchhx💐👍😟💐👻👻💐👻💐', '2026-07-07 06:06:08', 0),
(12, 12, 'user', 'Test User', 'hai to hai ', '2026-07-07 06:11:26', 0),
(13, 13, 'user', 'Test User', 'ggjxhxjjjfjjdhdjcjccjhchcxHamsterjjhhhhjjj gffdddd', '2026-07-07 06:11:56', 0),
(14, 14, 'user', 'Test User', 'ccgghhhbb', '2026-07-07 06:25:08', 0),
(15, 15, 'user', 'Test User', 'faarbarb', '2026-07-07 06:25:32', 0),
(16, 16, 'user', 'Test User', 'vs wcwcwfc', '2026-07-07 06:25:57', 0),
(17, 17, 'user', 'Test User', 'I added ₹500 to my wallet via UPI, amount got deducted from my bank account but wallet balance was not updated', '2026-07-07 07:00:11', 0),
(18, 17, 'admin', 'Admin', 'ok', '2026-07-07 07:02:23', 0),
(19, 15, 'admin', 'Admin', 'hii', '2026-07-07 07:32:55', 0),
(20, 18, 'astrologer', 'Test Astrologer', 'Amount deducted but not showing in history screen', '2026-07-07 07:55:46', 0),
(21, 15, 'user', 'user', 'hhhh', '2026-07-07 10:29:39', 0),
(22, 18, 'admin', 'Admin', 'ok', '2026-07-07 10:57:12', 0),
(23, 18, 'admin', 'Admin', 'hlo', '2026-07-07 11:01:22', 0),
(24, 15, 'admin', 'Admin', 'ok', '2026-07-07 11:02:04', 0),
(25, 15, 'user', 'user', 'Aman', '2026-07-07 11:02:27', 0),
(26, 15, 'admin', 'Admin', 'sumit', '2026-07-07 11:02:36', 0),
(27, 15, 'admin', 'Admin', 'ok', '2026-07-07 11:14:03', 0),
(28, 15, 'admin', 'Admin', '[image]', '2026-07-07 11:16:25', 0),
(29, 15, 'admin', 'Admin', '[image]', '2026-07-07 11:18:21', 0),
(30, 15, 'admin', 'Admin', '[image]', '2026-07-07 11:22:04', 0),
(31, 15, 'admin', 'Admin', '[image]', '2026-07-07 11:24:19', 0),
(32, 15, 'admin', 'Admin', '[image]', '2026-07-07 11:25:43', 0),
(33, 15, 'admin', 'Admin', '[image]', '2026-07-07 11:27:04', 0),
(34, 15, 'admin', 'Admin', '[image]', '2026-07-07 11:33:21', 0),
(35, 14, 'admin', 'Admin', '[image]', '2026-07-07 11:42:01', 0),
(36, 19, 'user', 'Test User', 'hello 🤗🤗🤗', '2026-07-07 11:42:43', 0),
(37, 19, 'user', 'user', 'hii', '2026-07-07 11:44:03', 0),
(38, 19, 'admin', 'Admin', '[image]', '2026-07-07 11:45:04', 0),
(39, 19, 'admin', 'Admin', '[image]', '2026-07-07 11:46:00', 0),
(40, 19, 'user', 'user', 'hh', '2026-07-07 12:05:14', 0),
(41, 19, 'user', 'user', '[image]', '2026-07-07 12:05:28', 0),
(42, 10, 'user', 'user', 'hii', '2026-07-07 12:10:57', 0),
(43, 20, 'user', 'Aman', 'chhnbb', '2026-07-18 07:25:10', 0),
(44, 20, 'user', 'user', 'hoi', '2026-07-18 07:36:07', 0),
(45, 20, 'admin', 'Admin', 'loi', '2026-07-18 07:36:18', 0),
(46, 20, 'user', 'user', '[image]', '2026-07-18 07:36:28', 0),
(47, 20, 'admin', 'Admin', '[image]', '2026-07-18 07:36:49', 0),
(48, 20, 'user', 'user', 'hii', '2026-07-18 07:40:16', 0),
(49, 20, 'user', 'user', '[image]', '2026-07-18 07:40:22', 0),
(50, 20, 'user', 'user', '[image]', '2026-07-18 07:42:39', 0),
(51, 20, 'user', 'user', '[image]', '2026-07-18 07:44:05', 0),
(52, 20, 'admin', 'Admin', 'okk', '2026-07-18 07:46:47', 0),
(53, 21, 'astrologer', 'Test Astrologer', 'dggyuu', '2026-07-18 07:57:18', 0),
(54, 21, 'admin', 'Admin', 'h', '2026-07-18 07:57:34', 0),
(55, 21, 'admin', 'Admin', 'kk', '2026-07-18 08:00:41', 0),
(56, 21, 'user', 'user', 'kkjh', '2026-07-18 08:04:43', 0),
(57, 21, 'admin', 'Admin', 'uuuu', '2026-07-18 08:04:50', 0),
(58, 21, 'user', 'user', '[image]', '2026-07-18 08:05:01', 0),
(59, 21, 'admin', 'Admin', '[image]', '2026-07-18 08:05:13', 0),
(60, 21, 'user', 'user', '[image]', '2026-07-18 08:07:09', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `birth_time` time DEFAULT NULL,
  `birth_place` varchar(150) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` enum('active','blocked') DEFAULT 'active',
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fcm_token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `mobile`, `gender`, `dob`, `birth_time`, `birth_place`, `profile_image`, `password`, `status`, `is_verified`, `created_at`, `updated_at`, `fcm_token`) VALUES
(25, '83037fb4-be35-4a40-8440-ab7d51953cbd', 'Harsh', 'harsh@gmail.com', '9793168164', 'male', '2002-03-01', '00:00:00', 'Lucknow, UP, India', '1782891072518-scaled_1000026439.png', NULL, 'active', 0, '2026-07-01 06:00:37', '2026-07-21 04:11:44', 'clL-cHxFRP22HdFr_y1yeT:APA91bF2BEvqyHmgXjde8mPS3dxfAY3yDM6mqD4N3gzune0uo_KuWtG6caMx8jk2B1Tp01wS6BKqL4LlY4LPIu_k1X1zSQZJnvexbxndgSpc5XEIdRhdRxs'),
(26, '01a5c133-63cf-4126-bc20-b1c4536de2ad', 'Test User', '', '9876543210', 'male', '2002-02-25', '02:30:00', 'Lucknow, UP, India', '1782893320188-scaled_1000026439.png', NULL, 'active', 0, '2026-07-01 07:49:47', '2026-07-21 17:42:44', 'eOZVdudbQIWlg-AmiOEKSj:APA91bFIfQDf22SyK3KFP3PPvZiuqUt2fjS4ZaOz14RRDUXkPmYu6iFe2BoMjm4DaLhX07I54yiMshK_GUWn7VTNbB9yGstFcbIMTjP_NiFBszpiyfvTHjQ'),
(27, '5a7199f4-5cef-4c5a-b797-cfb4fcfd7203', 'pika ', '', '7705020474', 'female', '2002-03-03', '04:01:00', 'Lucknow, UP, India', NULL, NULL, 'active', 0, '2026-07-09 08:13:17', '2026-07-09 08:13:17', NULL),
(28, 'a2136c7b-9914-4e5c-86bb-4b2be53a32ac', 'Aman', '', '7458946942', 'male', '2002-03-03', '04:01:00', 'Lucknow, UP, India', NULL, NULL, 'active', 0, '2026-07-18 04:08:39', '2026-07-21 13:03:43', 'csSILK27R1Czu_Ny9OMVuF:APA91bEs91ZJdD8ZQbGO-L2ChUR5E9eVn0eSLXD1ZcWXwcylteLq5B9EXVM12G5euhUFPc7Hy9J_RiUytwJ7iYiTyfhVnkON5H3gLtVilkPMsbug0AUny78'),
(29, 'd1e20545-c425-44ea-a849-0e2aedda1668', 'twgsga', '', '6316494949', 'male', '2002-03-03', '04:01:00', 'Lucknow, UP, India', NULL, NULL, 'active', 0, '2026-07-21 07:30:44', '2026-07-21 07:30:44', NULL),
(30, '9bc7cef8-3e87-49f0-9bec-28eff5bb12d2', 'eyey', '', '6307335502', 'male', '2002-03-03', '04:01:00', 'Lucknow, UP, India', NULL, NULL, 'active', 0, '2026-07-21 07:31:20', '2026-07-21 07:31:20', NULL),
(31, '679a7d9d-b3b2-4bbc-bad6-6679c2ea5c8d', 'Sahil', '', '7705015444', 'male', '1998-03-03', '00:00:00', 'Lucknow, UP, India', NULL, NULL, 'active', 0, '2026-07-21 13:04:02', '2026-07-22 09:20:51', 'ckCu0i5lR4uDsvVAFsQWog:APA91bGtJnmazNIr7fMjeYCWK1mfU9cIO5cGnsHpbpylVUctygeprTwDekEaJVoBZ8KmW9qMfdcmUn0od65p1bfzEw0NXse1tf1SFnqpBKax0NIeO_TnvvA'),
(32, 'ec9f6dc3-d85f-4caa-9a74-0b37053001ee', 'Abhishek Kumar Singh', '', '8090752235', 'male', '1986-03-14', '00:42:00', 'Varanasi, Uttar Pradesh, India', NULL, NULL, 'active', 0, '2026-07-21 14:25:07', '2026-07-21 14:25:07', NULL),
(33, 'c882d13f-7422-47cd-a555-de73bc9141a9', 'sumit', '', '9120471395', 'male', '2000-04-14', '16:30:00', 'Mohammadabad, Uttar Pradesh, India', '1784781677115-scaled_IMG20260712105303.jpg', NULL, 'active', 0, '2026-07-23 04:39:05', '2026-07-23 04:41:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_family_members`
--

CREATE TABLE `user_family_members` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(100) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `relation` varchar(50) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `birth_time` time DEFAULT NULL,
  `birth_place` varchar(150) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_family_members`
--

INSERT INTO `user_family_members` (`id`, `uuid`, `user_id`, `name`, `relation`, `gender`, `dob`, `birth_time`, `birth_place`, `is_active`, `created_at`, `updated_at`) VALUES
(19, 'd0741b9c-4ad4-478d-a3e0-db4fd3f52feb', 25, 'utkarsh', 'Brother', 'male', '2001-01-20', '11:39:00', 'mirzapur', 1, '2026-07-01 06:10:03', '2026-07-01 06:10:03');

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `astrologer_id` bigint(20) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet`
--

INSERT INTO `wallet` (`id`, `user_id`, `astrologer_id`, `balance`, `created_at`, `updated_at`) VALUES
(113, 25, NULL, 300.00, '2026-07-01 06:10:36', '2026-07-01 06:29:00'),
(114, 26, NULL, 49740.00, '2026-07-07 04:34:52', '2026-07-21 18:00:26'),
(115, 28, NULL, 40.00, '2026-07-18 04:27:44', '2026-07-18 07:48:51'),
(117, NULL, 61, 200.00, '2026-07-21 14:14:31', '2026-07-21 14:14:31'),
(118, NULL, 61, 400.00, '2026-07-21 14:32:48', '2026-07-21 14:32:48'),
(119, 31, NULL, 150.00, '2026-07-22 09:32:07', '2026-07-22 09:32:25');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `astrologer_id` bigint(20) DEFAULT NULL,
  `reference_id` bigint(20) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `type` enum('credit','debit','refund') DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `balance_before` decimal(10,2) DEFAULT NULL,
  `balance_after` decimal(10,2) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_ref` varchar(200) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'completed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `user_id`, `astrologer_id`, `reference_id`, `reference_type`, `type`, `amount`, `balance_before`, `balance_after`, `reason`, `payment_method`, `payment_ref`, `status`, `created_at`) VALUES
(1106, 25, NULL, NULL, NULL, 'credit', 200.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1782886010733_841254', 'pending', '2026-07-01 06:06:51'),
(1107, 25, NULL, NULL, NULL, 'credit', 500.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1782886082215_357408', 'pending', '2026-07-01 06:08:02'),
(1108, 25, NULL, 5114930827786, NULL, 'credit', 500.00, 0.00, 500.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1782886216482_112540', 'completed', '2026-07-01 06:10:16'),
(1109, 25, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-01 06:26:01'),
(1110, 25, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-01 06:27:01'),
(1111, 25, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-01 06:28:00'),
(1112, 25, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-01 06:29:00'),
(1113, 26, NULL, NULL, NULL, 'credit', 5.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319013992_278293', 'pending', '2026-07-06 06:23:34'),
(1114, 26, NULL, NULL, NULL, 'credit', 55.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319047918_502580', 'pending', '2026-07-06 06:24:08'),
(1115, 26, NULL, NULL, NULL, 'credit', 50.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319069799_753760', 'pending', '2026-07-06 06:24:30'),
(1116, 26, NULL, NULL, NULL, 'credit', 500.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319081919_816879', 'pending', '2026-07-06 06:24:42'),
(1117, 26, NULL, NULL, NULL, 'credit', 100.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319118468_88328', 'pending', '2026-07-06 06:25:18'),
(1118, 26, NULL, NULL, NULL, 'credit', 100.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319147803_995116', 'pending', '2026-07-06 06:25:48'),
(1119, 26, NULL, NULL, NULL, 'credit', 25.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319174305_560819', 'pending', '2026-07-06 06:26:14'),
(1120, 26, NULL, NULL, NULL, 'credit', 23.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319188852_30087', 'pending', '2026-07-06 06:26:29'),
(1121, 26, NULL, NULL, NULL, 'credit', 200.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319282830_570437', 'pending', '2026-07-06 06:28:03'),
(1122, 26, NULL, NULL, NULL, 'credit', 200.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319315272_939614', 'pending', '2026-07-06 06:28:35'),
(1123, 26, NULL, NULL, NULL, 'credit', 100.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319474461_945722', 'pending', '2026-07-06 06:31:14'),
(1124, 26, NULL, NULL, NULL, 'credit', 200.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783319489079_20076', 'pending', '2026-07-06 06:31:29'),
(1125, 26, NULL, NULL, NULL, 'credit', 100.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783398278700_982260', 'pending', '2026-07-07 04:24:38'),
(1126, 26, NULL, 5114931273399, NULL, 'credit', 50000.00, 0.00, 50000.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783398880506_60347', 'completed', '2026-07-07 04:34:40'),
(1127, 27, NULL, NULL, NULL, 'credit', 200.00, 0.00, 0.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1783584844793_987473', 'pending', '2026-07-09 08:14:04'),
(1128, 28, NULL, 5114932206830, NULL, 'credit', 100.00, 0.00, 100.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1784348847750_334307', 'completed', '2026-07-18 04:27:28'),
(1129, 28, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-18 04:39:55'),
(1130, 28, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-18 04:40:24'),
(1131, 28, NULL, 5114932210680, NULL, 'credit', 500.00, 0.00, 500.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1784349647115_423892', 'completed', '2026-07-18 04:40:47'),
(1132, 28, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-18 04:41:23'),
(1133, 28, NULL, NULL, NULL, 'debit', 80.00, NULL, NULL, 'video call', NULL, NULL, 'completed', '2026-07-18 04:41:42'),
(1134, 28, NULL, NULL, NULL, 'debit', 80.00, NULL, NULL, 'video call', NULL, NULL, 'completed', '2026-07-18 04:41:47'),
(1135, 28, NULL, NULL, NULL, 'debit', 80.00, NULL, NULL, 'video call', NULL, NULL, 'completed', '2026-07-18 04:42:15'),
(1136, 28, NULL, NULL, NULL, 'debit', 80.00, NULL, NULL, 'video call', NULL, NULL, 'completed', '2026-07-18 04:43:43'),
(1137, 28, NULL, NULL, NULL, 'debit', 30.00, NULL, NULL, 'Chat Consultation', NULL, NULL, 'completed', '2026-07-18 06:21:54'),
(1138, 28, NULL, NULL, NULL, 'debit', 30.00, NULL, NULL, 'Chat Consultation', NULL, NULL, 'completed', '2026-07-18 07:15:15'),
(1139, 28, NULL, NULL, NULL, 'debit', 30.00, NULL, NULL, 'Chat Consultation', NULL, NULL, 'completed', '2026-07-18 07:48:51'),
(1140, NULL, 61, NULL, NULL, 'credit', 200.00, 0.00, 200.00, 'Referral bonus for approving astrologer #62', NULL, NULL, 'completed', '2026-07-21 14:14:31'),
(1141, NULL, 61, NULL, NULL, 'credit', 200.00, 200.00, 400.00, 'Referral bonus for approving astrologer #64', NULL, NULL, 'completed', '2026-07-21 14:32:48'),
(1142, 26, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-21 17:43:12'),
(1143, 26, NULL, NULL, NULL, 'debit', 80.00, NULL, NULL, 'video call', NULL, NULL, 'completed', '2026-07-21 17:43:54'),
(1144, 26, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-21 18:00:10'),
(1145, 26, NULL, NULL, NULL, 'debit', 80.00, NULL, NULL, 'video call', NULL, NULL, 'completed', '2026-07-21 18:00:26'),
(1146, 31, NULL, 5114932529126, NULL, 'credit', 200.00, 0.00, 200.00, 'Wallet recharge via Cashfree', 'cashfree', 'ORDER_1784712693590_323737', 'completed', '2026-07-22 09:31:33'),
(1147, 31, NULL, NULL, NULL, 'debit', 50.00, NULL, NULL, 'audio call', NULL, NULL, 'completed', '2026-07-22 09:32:25');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal_charges`
--

CREATE TABLE `withdrawal_charges` (
  `id` int(11) NOT NULL,
  `tds_percent` decimal(5,2) DEFAULT 5.00,
  `processing_percent` decimal(5,2) DEFAULT 2.00,
  `fixed_processing_fee` decimal(10,2) DEFAULT 0.00,
  `is_active` tinyint(4) DEFAULT 1,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `min_withdrawal` decimal(10,2) DEFAULT 100.00,
  `max_withdrawal` decimal(10,2) DEFAULT 50000.00,
  `suggested_amounts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`suggested_amounts`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `withdrawal_charges`
--

INSERT INTO `withdrawal_charges` (`id`, `tds_percent`, `processing_percent`, `fixed_processing_fee`, `is_active`, `updated_at`, `min_withdrawal`, `max_withdrawal`, `suggested_amounts`) VALUES
(3, 5.00, 2.00, 0.00, 1, '2026-06-25 12:43:03', 100.00, 50000.00, '[100,200,300,400,500,1000,20000,30000]');

-- --------------------------------------------------------

--
-- Table structure for table `zodiac_signs`
--

CREATE TABLE `zodiac_signs` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `slug` varchar(50) DEFAULT NULL,
  `symbol` varchar(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `symbol_image` varchar(255) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zodiac_signs`
--

INSERT INTO `zodiac_signs` (`id`, `name`, `slug`, `symbol`, `image`, `created_at`, `symbol_image`, `color`) VALUES
(1, 'Aries', 'aries', '♈', 'aries.png', '2026-05-23 12:16:29', 'aries_with_side_lock.png', '#FFEDE7F6'),
(2, 'Taurus', 'taurus', '♉', 'taurus.png', '2026-05-23 12:16:29', 'taurus_with_side_lock.png', '#FFFFF8E1'),
(3, 'Gemini', 'gemini', '♊', 'gemini.png', '2026-05-23 12:16:29', 'gemini_with_side_lock.png', '#FFFFF3E0'),
(4, 'Cancer', 'cancer', '♋', 'cancer.png', '2026-05-23 12:16:29', 'cancer_with_side_lock.png', '#FFFFEBEE'),
(5, 'Leo', 'leo', '♌', 'leo.png', '2026-05-23 12:16:29', 'leo_with_side_lock.png', '#FFFFF8E1'),
(6, 'Virgo', 'virgo', '♍', 'virgo.png', '2026-05-23 12:16:29', 'virgo_with_side_lock.png', '#FFFCE4EC'),
(7, 'Libra', 'libra', '♎', 'libra.png', '2026-05-23 12:16:29', 'libra_with_side_lock.png', '#FFE8F5E9'),
(8, 'Scorpio', 'scorpio', '♏', 'scorpio.png', '2026-05-23 12:16:29', 'scorpio_with_side_lock.png', '#FFEDE7F6'),
(9, 'Sagittarius', 'sagittarius', '♐', 'sagittarius.png', '2026-05-23 12:16:29', 'sagittarius_with_side_lock.png', '#FFFFF3E0'),
(10, 'Capricorn', 'capricorn', '♑', 'capricorn.png', '2026-05-23 12:16:29', 'capricorn_with_side_lock.png', '#FFE3F2FD'),
(11, 'Aquarius', 'aquarius', '♒', 'aquarius.png', '2026-05-23 12:16:29', 'aquarius_with_side_lock.png', '#FFE8F5E9'),
(12, 'Pisces', 'pisces', '♓', 'pisces.png', '2026-05-23 12:16:29', 'pisces_with_side_lock.png', '#FFEDE7F6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_payouts`
--
ALTER TABLE `admin_payouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_id` (`admin_id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_admin_email` (`email`);

--
-- Indexes for table `app_contents`
--
ALTER TABLE `app_contents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ac_type` (`type`),
  ADD KEY `idx_ac_status` (`status`);

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_settings_key` (`key`);

--
-- Indexes for table `astrologers`
--
ALTER TABLE `astrologers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `referral_code` (`referral_code`),
  ADD KEY `idx_astro_phone` (`phone`),
  ADD KEY `idx_astro_email` (`email`),
  ADD KEY `idx_astro_approval` (`approval_status`);

--
-- Indexes for table `astrologer_expertise`
--
ALTER TABLE `astrologer_expertise`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_astro_exp` (`astrologer_id`,`expertise_id`),
  ADD KEY `idx_ae_astrologer` (`astrologer_id`),
  ADD KEY `idx_ae_expertise` (`expertise_id`);

--
-- Indexes for table `astrologer_languages`
--
ALTER TABLE `astrologer_languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_astro_lang` (`astrologer_id`,`language`),
  ADD KEY `idx_al_astrologer` (`astrologer_id`);

--
-- Indexes for table `astrologer_reviews`
--
ALTER TABLE `astrologer_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `astrologer_withdrawals`
--
ALTER TABLE `astrologer_withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_aw_astrologer` (`astrologer_id`),
  ADD KEY `idx_aw_status` (`status`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_banner_status` (`status`),
  ADD KEY `idx_banner_type` (`type`);

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_block` (`blocker_user_id`,`blocker_astrologer_id`,`blocked_user_id`,`blocked_astrologer_id`);

--
-- Indexes for table `call_history`
--
ALTER TABLE `call_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_channel` (`channel_name`),
  ADD KEY `idx_ch_user` (`user_id`),
  ADD KEY `idx_ch_agent` (`agent_id`),
  ADD KEY `idx_ch_status` (`status`),
  ADD KEY `idx_ch_type` (`call_type`),
  ADD KEY `idx_ch_created` (`created_at`);

--
-- Indexes for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD KEY `idx_cc_user` (`user_id`),
  ADD KEY `idx_cc_astrologer` (`astrologer_id`),
  ADD KEY `idx_cc_status` (`status`),
  ADD KEY `idx_cc_created` (`created_at`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD KEY `idx_cm_conv` (`conversation_id`),
  ADD KEY `idx_cm_sender` (`sender_type`,`sender_id`),
  ADD KEY `idx_cm_sent_at` (`sent_at`);

--
-- Indexes for table `expertise_master`
--
ALTER TABLE `expertise_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`astrologer_id`),
  ADD KEY `astrologer_id` (`astrologer_id`);

--
-- Indexes for table `gift_amounts`
--
ALTER TABLE `gift_amounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `horoscopes`
--
ALTER TABLE `horoscopes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `zodiac_id` (`zodiac_id`);

--
-- Indexes for table `live_comments`
--
ALTER TABLE `live_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_live_comment_stream` (`stream_id`),
  ADD KEY `fk_live_comment_user` (`user_id`);

--
-- Indexes for table `live_gifts`
--
ALTER TABLE `live_gifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_live_gift_stream` (`stream_id`),
  ADD KEY `fk_live_gift_user` (`user_id`),
  ADD KEY `fk_live_gift_astrologer` (`astrologer_id`);

--
-- Indexes for table `live_likes`
--
ALTER TABLE `live_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`stream_id`,`user_id`),
  ADD KEY `fk_live_like_user` (`user_id`);

--
-- Indexes for table `live_streams`
--
ALTER TABLE `live_streams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stream_key` (`stream_key`),
  ADD KEY `fk_live_stream_astrologer` (`astrologer_id`);

--
-- Indexes for table `live_viewers`
--
ALTER TABLE `live_viewers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_live_viewer_stream` (`stream_id`),
  ADD KEY `fk_live_viewer_user` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notif_user` (`user_id`),
  ADD KEY `idx_notif_astro` (`astrologer_id`),
  ADD KEY `idx_notif_target` (`target_type`),
  ADD KEY `idx_notif_status` (`status`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`);

--
-- Indexes for table `panchang`
--
ALTER TABLE `panchang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`);

--
-- Indexes for table `panchang_month_dates`
--
ALTER TABLE `panchang_month_dates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `panchang_date` (`panchang_date`);

--
-- Indexes for table `referral_histories`
--
ALTER TABLE `referral_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `referrer_id` (`referrer_id`),
  ADD KEY `referred_astrologer_id` (`referred_astrologer_id`);

--
-- Indexes for table `referral_settings`
--
ALTER TABLE `referral_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ref_user` (`user_id`),
  ADD KEY `idx_ref_status` (`status`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_id` (`ticket_id`);

--
-- Indexes for table `support_ticket_attachments`
--
ALTER TABLE `support_ticket_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`),
  ADD KEY `ticket_id` (`ticket_id`);

--
-- Indexes for table `support_ticket_messages`
--
ALTER TABLE `support_ticket_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_id` (`ticket_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `mobile` (`mobile`);

--
-- Indexes for table `user_family_members`
--
ALTER TABLE `user_family_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_wallet_user` (`user_id`),
  ADD KEY `idx_wallet_astro` (`astrologer_id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_wt_user` (`user_id`),
  ADD KEY `idx_wt_astro` (`astrologer_id`),
  ADD KEY `idx_wt_type` (`type`),
  ADD KEY `idx_wt_status` (`status`),
  ADD KEY `idx_wt_created` (`created_at`);

--
-- Indexes for table `withdrawal_charges`
--
ALTER TABLE `withdrawal_charges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zodiac_signs`
--
ALTER TABLE `zodiac_signs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_payouts`
--
ALTER TABLE `admin_payouts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `app_contents`
--
ALTER TABLE `app_contents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `astrologers`
--
ALTER TABLE `astrologers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `astrologer_expertise`
--
ALTER TABLE `astrologer_expertise`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `astrologer_languages`
--
ALTER TABLE `astrologer_languages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `astrologer_reviews`
--
ALTER TABLE `astrologer_reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `astrologer_withdrawals`
--
ALTER TABLE `astrologer_withdrawals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `blocks`
--
ALTER TABLE `blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `call_history`
--
ALTER TABLE `call_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=827;

--
-- AUTO_INCREMENT for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=370;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=678;

--
-- AUTO_INCREMENT for table `expertise_master`
--
ALTER TABLE `expertise_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `gift_amounts`
--
ALTER TABLE `gift_amounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `horoscopes`
--
ALTER TABLE `horoscopes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT for table `live_comments`
--
ALTER TABLE `live_comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `live_gifts`
--
ALTER TABLE `live_gifts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `live_likes`
--
ALTER TABLE `live_likes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9987;

--
-- AUTO_INCREMENT for table `live_streams`
--
ALTER TABLE `live_streams`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT for table `live_viewers`
--
ALTER TABLE `live_viewers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1073;

--
-- AUTO_INCREMENT for table `panchang`
--
ALTER TABLE `panchang`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `panchang_month_dates`
--
ALTER TABLE `panchang_month_dates`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=610;

--
-- AUTO_INCREMENT for table `referral_histories`
--
ALTER TABLE `referral_histories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `referral_settings`
--
ALTER TABLE `referral_settings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `refunds`
--
ALTER TABLE `refunds`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `support_ticket_attachments`
--
ALTER TABLE `support_ticket_attachments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `support_ticket_messages`
--
ALTER TABLE `support_ticket_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `user_family_members`
--
ALTER TABLE `user_family_members`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `wallet`
--
ALTER TABLE `wallet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1148;

--
-- AUTO_INCREMENT for table `withdrawal_charges`
--
ALTER TABLE `withdrawal_charges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `zodiac_signs`
--
ALTER TABLE `zodiac_signs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
