#!perl -T

use strict;
use warnings;

use Audit::DBI;
use Config::Tiny;
use DBI;
use Test::More tests => 10;
use Test::Exception;


my $DATA_FILE = 'audit_test_data.tmp';

my $config;
lives_ok(
	sub
	{
		$config = Config::Tiny->read( $DATA_FILE );
	},
	'Load config file.',
) || diag( "Error: $Config::Tiny::errstr." );

my $test_event = $config->{'main'}->{'event'};
my $test_subject_type = $config->{'main'}->{'subject_type'};
my $test_subject_id = $config->{'main'}->{'subject_id'};
my $test_ip_address = $config->{'main'}->{'ip_address'};
my $random_string = $config->{'main'}->{'random_string'};

ok(
	my $dbh = DBI->connect(
		'dbi:SQLite:dbname=t/test_database',
		'',
		'',
		{
			RaiseError => 1,
		}
	),
	'Create connection to a SQLite database.',
);

ok(
	my $audit = Audit::DBI->new(
		database_handle => $dbh,
	),
	'Create a new Audit::DBI object.',
);

ok(
	defined(
		my $audit_events = $audit->review(
			subjects =>
			[
				{
					include => 1,
					type    => $test_subject_type,
					ids     =>
					[
						$test_subject_id,
					],
				},
			],
		)
	),
	'Retrieve audit records.',
);

is(
	scalar( @$audit_events ),
	1,
	'Find one record matching the unique subject ID.',
);

my $audit_event = $audit_events->[0];

isa_ok(
	$audit_event,
	'Audit::DBI::Event',
	'$audit_event',
);

is(
	$audit_event->{'event'},
	$test_event,
	'The event matches what was sent to audit().',
);

is(
	$audit_event->{'subject_type'},
	$test_subject_type,
	'The sbuject type matches what was sent to audit().',
);

is(
	$audit_event->{'subject_id'},
	$test_subject_id,
	'The subject ID matches what was sent to audit().',
);

is(
	$audit_event->get_ipv4_address(),
	$test_ip_address,
	'The IP address matches what was sent to audit().',
);

#TODO - test event information / diff.
