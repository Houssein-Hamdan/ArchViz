<?php

namespace Tests\Feature\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Architecture;
use PHPUnit\Framework\Attributes\Test;

class ArchitectureDatabaseTest extends TestCase
{
    use RefreshDatabase;

    /* -------------------------------------------------------------------------- */
    /*                          1. MODEL RELATIONSHIPS                            */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function architecture_belongs_to_a_user()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $architecture = Architecture::create([
            'user_id' => $user->id,
            'title' => 'Test Relational App',
            'prompt_input' => 'Design microservices',
            'share_slug' => 'test-rel-app',
            'is_public' => true,
            'diagram_json' => ['nodes' => []]
        ]);

        // Verify inverse BelongsTo relationship instance and owner key match
        $this->assertInstanceOf(User::class, $architecture->user);
        $this->assertEquals($user->id, $architecture->user->id);
    }

    #[Test]
    public function user_has_many_architectures()
    {
        /** @var User $user */
        $user = User::factory()->create();

        Architecture::create([
            'user_id' => $user->id,
            'title' => 'Project 1',
            'prompt_input' => 'Prompt 1',
            'share_slug' => 'proj-1',
            'diagram_json' => ['nodes' => []]
        ]);

        Architecture::create([
            'user_id' => $user->id,
            'title' => 'Project 2',
            'prompt_input' => 'Prompt 2',
            'share_slug' => 'proj-2',
            'diagram_json' => ['nodes' => []]
        ]);

        // Assert HasMany relationship properly collects linked architecture records
        $this->assertCount(2, $user->architectures);
    }

    /* -------------------------------------------------------------------------- */
    /*                          2. CASTS & DATA INTEGRITY                         */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function diagram_json_is_automatically_cast_to_array()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $diagramData = [
            'nodes' => [
                ['id' => '1', 'type' => 'frontend', 'label' => 'React App'],
                ['id' => '2', 'type' => 'backend', 'label' => 'Laravel API']
            ],
            'edges' => [
                ['source' => '1', 'target' => '2']
            ]
        ];

        $architecture = Architecture::create([
            'user_id' => $user->id,
            'title' => 'Casting Test Architecture',
            'prompt_input' => 'Cast test',
            'share_slug' => 'cast-test-slug',
            'diagram_json' => $diagramData
        ]);

        // Fetch fresh model instance to test Eloquent attribute casting
        $fetchedArchitecture = Architecture::find($architecture->id);

        // Verify JSON string stored in DB is hydrated back into a PHP array
        $this->assertIsArray($fetchedArchitecture->diagram_json);
        $this->assertEquals('React App', $fetchedArchitecture->diagram_json['nodes'][0]['label']);
    }

    /* -------------------------------------------------------------------------- */
    /*                        3. CASCADE DELETE & CLEANUP                         */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function deleting_user_cascades_and_removes_their_architectures()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $architecture = Architecture::create([
            'user_id' => $user->id,
            'title' => 'Will Be Deleted Project',
            'prompt_input' => 'Delete test',
            'share_slug' => 'delete-test-slug',
            'diagram_json' => ['nodes' => []]
        ]);

        // Delete parent model to trigger database foreign key constraint cascade
        $user->delete();

        // Assert associated child architecture record is automatically removed
        $this->assertDatabaseMissing('architectures', [
            'id' => $architecture->id
        ]);
    }
}